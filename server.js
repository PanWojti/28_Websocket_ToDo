const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));

// add endpoint with app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.broadcast.to(socket.id).emit('updateData', tasks);
  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskname);
  });
  socket.on('removeTask', (index) => {
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', index);
  });
});
