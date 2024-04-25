const express = require('express');
const path = require('path');
const Notes = require("./helper/notes")

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const store = new Notes();

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// GET Route for the api notes
app.get('/api/notes', (req, res) => {
  store.getNotes().then((notes) => {
    return res.json(notes)
    }).catch((err) => res.status(500).json(err))
  }
);

app.post('/api/notes', (req, res) => {
  store.addNotes(req.body).then((note) => {
    return res.json(note)
  }).catch((err) => res.status(500).json(err))
})

app.delete("/api/notes/:id", (req, res) => {
  store.deleteNotes(req.params.id).then(() => {
    return res.json({delete: true, id: req.params.id})
  })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);