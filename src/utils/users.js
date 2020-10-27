const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
//Validate the data
    if(!username || !room){
        return {
            error: 'User name and room is required!'
        }
    }
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username 
    })
    //Validate username 
    if (existingUser){
        return {
            error: 'Username is already in use!'
        }
    }
    //Store user
    const user = {
        id,
        username, 
        room
    }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
     
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

addUser({
    id:22,
    username: 'Alish  ',
    room: '  south Delhi'
})

addUser({
    id:23,
    username: 'MC Mikey  ',
    room: '  south Delhi'
})

addUser({
    id:24,
    username: 'Payal',
    room: 'West Delhi'
})

const user = getUser(241)
console.log(user)

const userList = getUserInRoom('west ')
console.log(userList)
