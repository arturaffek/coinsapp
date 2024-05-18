const express = require('express')
const app = express();
const { port } = require('./config')
const apiRouter = require('./app/routes/api')
const cors = require('cors')

//parsery - for body -> content-type: application/json
// middleware
app.use(express.json());
// app.use(express.urlencoded());
//db
app.use(cors())

require('./app/db/mongoose')
//routes
app.use('/api/', apiRouter)

//server
app.listen(port, function() {
    console.log('serwer '+port)
})
