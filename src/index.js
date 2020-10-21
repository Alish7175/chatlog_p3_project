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

let count = 0

io.on('connection', (socket) =>{
    console.log('New websocket connections')

    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'new user has joined the chat')

    socket.on('sendMessage', (message) =>{     
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        io.emit('message', 'User left the chat')
    })
    socket.on('sendLocation', (coords) =>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })
    // socket.emit('countUpdated', count)
    // socket.on('increment', () =>{
    //     count ++
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // } )
})

Server.listen(port, () =>{
    console.log(`Server is on port ${port}`)
})