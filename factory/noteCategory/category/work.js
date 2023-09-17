const NoteCategory = require('../note');

class WorkNote extends NoteCategory{
  constructor () {
    super('Work')
  }
}

module.exports = WorkNote;
