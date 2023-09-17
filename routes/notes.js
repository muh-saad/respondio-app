const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const {verifyToken} = require('../common/token');
const logger = require('../common/logger')

const sequelize = require('../models'); // Import your Sequelize models
const Sequelize = require('sequelize');

const {RedisCache} = require('../db/redis')

// Initialize note model
const Note = require('../models/note')(sequelize, Sequelize.DataTypes);
const NoteFactory = require('../factory/noteFactory')

// Create a new note with a specific category using NoteFactory
router.post('/', verifyToken, [
    check('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string'),
    check('content')
      .notEmpty()
      .withMessage('Content is required')
      .isString()
      .withMessage('Content must be a string'),
    check('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['Work', 'Personal'])
      .withMessage('Invalid note category provided. Allowed value: Work, Personal')
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    
    try {
      const {title, content, category} = req.body; // Include 'category' in the request body
      
      const note = NoteFactory.getNote(category);
      const createdNote = await note.create(title, content, req);
      
      res.status(201).json({message: 'Note created successfully', note: createdNote});
    } catch (error) {
      logger.error(error);
      res.status(500).json({message: error.message});
    }
  });

// Get all notes for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {userId: req.userId},
    });
    
    res.status(200).json(notes);
  } catch (error) {
    logger.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

// Get a single note for authenticated user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const {id} = req.params;
    
    logger.info(`Getting note from Redis`);
    let note = JSON.parse(await RedisCache.get('notes', id));
    if (note) return res.status(200).json(note || {});
    
    logger.info(`Getting note from DB`);
    note = await Note.findOne({
      where: {userId: req.userId, id},
    });
    if (!note) {
      throw new Error('Note not found.');
    }
    
    await RedisCache.setWithExpiry('notes', id, JSON.stringify(note));
    
    res.status(200).json(note || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
});

// Get all notes of a specific category for the authenticated user using NoteFactory
router.get('/category/:category', verifyToken, [
    check('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['Work', 'Personal'])
      .withMessage('Invalid note category provided. Allowed value: Work, Personal')
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    
    try {
      const {category} = req.params;
      
      const note = NoteFactory.getNote(category);
      const getNote = await note.get(req);
      
      res.status(200).json(getNote || {});
    } catch (error) {
      logger.error(error);
      res.status(500).json({message: error.message});
    }
  });

// Update a note for the authenticated user
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const {title, content} = req.body;
    const noteId = req.params.id;
    
    const updatedNote = await Note.update(
      {title, content},
      {where: {id: noteId, userId: req.userId}}
    );
    
    let redisNote = JSON.parse(await RedisCache.get('notes', noteId));
    if (redisNote) {
      let note = await Note.findOne({
        where: {userId: req.userId, id: noteId},
      });
      await RedisCache.setWithExpiry('notes', noteId, JSON.stringify(note));
    }
    
    if (updatedNote[0] === 0) {
      return res.status(404).json({message: 'Note not found or unauthorized'});
    }
    
    res.status(200).json({message: 'Note updated successfully'});
  } catch (error) {
    logger.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

// Delete a note for the authenticated user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    
    const deletedNote = await Note.destroy({
      where: {id: noteId, userId: req.userId},
    });
    
    if (!deletedNote) {
      return res.status(404).json({message: 'Note not found or unauthorized'});
    }
    
    res.status(200).json({message: 'Note deleted successfully'});
  } catch (error) {
    logger.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;
