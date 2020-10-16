const path = require('path')
const http = require('http')
const express = require('express')

const app = express()
const Server =  http.createServer(app)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.listen(port, () =>{
    console.log(`Server is on port ${port}`)
})