const WorkNote = require('../factory/noteCategory/category/work')
const PersonalNote = require('../factory/noteCategory/category/personal')

class NoteFactory {
  getNote(type) {
    switch (type) {
      case 'Work':
        return new WorkNote();
      case 'Personal':
        return new PersonalNote();
      default: {
        throw new Error('Note category not supported');
      }
    }
  }
}

module.exports = new NoteFactory();
