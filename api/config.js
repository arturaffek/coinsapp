require('dotenv').config()

module.exports = {
   port: process.env.PORT||3001,
   database: process.env.DATABASE||mongodb+srv://hello:kjhTScaTvQtFIP9k@cluster0.dsz30a5.mongodb.net/?retryWrites=true&w=majority
}
