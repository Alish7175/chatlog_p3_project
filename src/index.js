const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const Server =  http.createServer(app)
const io = socketio(Server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', () =>{
    console.log('New websocket connections')
})

Server.listen(port, () =>{
    console.log(`Server is on port ${port}`)
})