import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./chat.socket.js";

const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
     origin: [
      "http://localhost:5173",
      "https://anilflowers.vercel.app/"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
  });

  /* HANDSHAKE AUTH  Middlewareex */
  io.use(socketAuth);

  // Listen for global server events like establishing connection
  io.on("connection", (socket) => {
    console.log(" Connected:", socket.user.id);

    chatHandler(io, socket);
  });

};

export default initSocket;