const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let ioInstance = null;

function configuraSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Token mancante"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        }catch (error) {
            next(new Error("Token non valido"));
        }
    });

    io.on("connection", (socket) => {
        console.log('Utente connesso via socketr.io: ${socket.userId}');
        
        socket.join(socket.userId.toString());
        socket.on("disconnect", () => {
            console.log('Utente disconnesso: ${socket.userId}');
        });
    });

    ioInstance = io;

    return io;

}


function getIO() {
    if (!ioInstance) {
        throw new Error("Socket.io non è stato inizializzato. Chiama prima 'configuraSocket(server)'");
    }
    return ioInstance;

}

module.exports = { configuraSocket, getIO};