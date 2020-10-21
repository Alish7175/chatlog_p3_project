

const socket = io()

socket.on('message', (message) =>{
    console.log(message)
})

// socket.on('countUpdated', (count) =>{
//     console.log('The count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () =>{
//     console.log('clicked')
//     socket.emit('increment')
// })

document.querySelector('#messageForm').addEventListener('submit', (e) =>{
    e.preventDefault()

    const msg = e.target.elements.message.value
    socket.emit('sendMessage', msg)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('geoloaction is not supported for your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})