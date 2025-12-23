import app from "./app.js";
import http from "http"
import { Server } from "socket.io";


const PORT = process.env.PORT || 3000

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin : '*'
    }
})

io.on('connection', (socket) => {
    console.log('Client Connected :', socket.id)
})

app.set('io', io)
server.listen(3000, () => console.log(`Server Running on port : ${PORT}`))