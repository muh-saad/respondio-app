const sequelize = require('../../models'); // Import your Sequelize models
const Sequelize = require('sequelize');

// Initialize note model
const DBNote = require('../../models/note')(sequelize, Sequelize.DataTypes);

class Note {
  constructor(category) {
    this.category = category;
  }
  
  async create(title, content, req) {
    try {
      return await DBNote.create({
        title,
        content,
        userId: req.userId,
        category: this.category, // Save the category in the database
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  
  async get(req) {
    try {
      return await DBNote.findAll({
        where: {userId: req.userId, category: this.category}, // Filter by category
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Note;
