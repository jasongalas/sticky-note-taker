const util = require("util")
const fs = require('fs')
const uuid = require("./uuid")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

class Notes {
  read(){
    return readFile("./db/db.json", "utf8")
  }
  write(note){
    return writeFile("./db/db.json", JSON.stringify(note, null, 4))
  }
  getNotes (){
    return this.read().then((notes) => {
      let parsedNotes;
        try {
          parsedNotes = [].concat(JSON.parse(notes))
        } catch (error){
          parsedNotes = [];
        }
        return parsedNotes;
    })
  }
  addNotes(notes){
    const { title, text } = notes;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      }

      return this.getNotes().then((notes) => [...notes, newNote])
      .then((newNotes) => this.write(newNotes)).then(() => newNote)

    } else {
      throw new Error("Title and text cannot be blank :[")
    }
  }
  deleteNotes(id){
    return this.getNotes().then((notes) => notes.filter((note) => note.id !== id))
    .then((filteredNotes) => this.write(filteredNotes))
  }
}

module.exports = Notes;