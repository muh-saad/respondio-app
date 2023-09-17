const NoteCategory = require('../note');

class PersonalNote extends NoteCategory{
  constructor () {
    super('Personal')
  }
}

module.exports = PersonalNote;
