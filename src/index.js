const path = require('path')
const http = require('http')
const express = require('express')
const mongodb = require('mongodb')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Database connection starts
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb+srv://alish:alish123@cluster0.e27pd.mongodb.net/chatlog?retryWrites=true&w=majority'
const databaseName = 'chatlog'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error){
       return console.log('Unable to connect to database ')
    }
    console.log('connected to database!!')

    const db = client.db(databaseName)
    db.collection('chatLogUsers').insertOne({
        username: 'Alish',
        email: "alishmadhukar75@gmail.com",
        password:"abcd1234"
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user')
        }
        console.log(result.ops)
    })
})

//database related work ends

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {

        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            } )
        } 
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})