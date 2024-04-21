const express = require('express');
const router = express.Router()

const coinsContollers = require('../controllers/api/coinsController')

// ENDPOINTS USES IN FRONT WITH AXIOS

router.get('/notes', coinsContollers.getAllNotes)

router.get('/notes/:id', coinsContollers.getNote)

router.post('/notes', coinsContollers.saveNote)

router.put('/notes/:id', coinsContollers.updateNote)

router.delete('/notes/:id', coinsContollers.deleteNote)

module.exports = router