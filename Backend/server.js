// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// connect DB
connectDB(process.env.MONGO_URI);

// middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// helper to build a room id between two user ids
const roomIdFor = (a, b) => {
  const [x, y] = [a.toString(), b.toString()].sort();
  return `room_${x}_${y}`;
};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', ({ userId }) => {
    socket.userId = userId;
    console.log(`Socket ${socket.id} joined as user ${userId}`);
  });

  socket.on('startConversation', ({ withUserId }) => {
    if (!socket.userId) return;
    const room = roomIdFor(socket.userId, withUserId);
    socket.join(room);
    console.log(`${socket.userId} joined room ${room}`);
  });

  socket.on('sendMessage', async ({ to, text, skill }) => {
    try {
      if (!socket.userId) return;
      // persist
      const msg = await Message.create({
        sender: socket.userId,
        receiver: to,
        text,
        skill
      });
      const room = roomIdFor(socket.userId, to);
      io.to(room).emit('newMessage', msg);
    } catch (err) {
      console.error('sendMessage error', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

// start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
