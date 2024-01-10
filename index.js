const http = require('http')
const server = http.createServer((req, res)=>{
    res.end("Hello There")
});

server.listen('3005', 'localhost', (err) => {
    if (!err) {
        console.log("Server is running ^_^")
    }
})