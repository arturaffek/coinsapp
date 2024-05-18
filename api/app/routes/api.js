const express = require('express');
const router = express.Router()

const coinsContollers = require('../controllers/api/coinsController')

// ENDPOINTS USES IN FRONT WITH AXIOS

router.get('/coins', coinsContollers.getAllCoins)

router.get('/coins/:id', coinsContollers.getCoin)

router.post('/coins', coinsContollers.saveCoin)

router.put('/coins/:id', coinsContollers.updateCoin)

router.delete('/coins/:id', coinsContollers.deleteCoin)

module.exports = router