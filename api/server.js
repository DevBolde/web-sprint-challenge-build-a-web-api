// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!
const express = require('express');
const projectRouter = require('./projects/projects-router')

const server = express();

server.use(express.json());
server.use(projectRouter)












module.exports = server;



