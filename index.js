const app = require('./src/config/express.config')
const http = require('http')

const server = http.createServer(app)

server.listen('3005', 'localhost', (error)=>{
    if(!error){
        console.log("Server is Running Sir ^.^")
    }
})