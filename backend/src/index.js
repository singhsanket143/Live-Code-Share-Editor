import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PORT, ALLOWED_ORIGIN } from './config/server.config.js';
import yws from 'y-websocket/bin/utils';

const app = express();

app.use(cors({
    origin: [ALLOWED_ORIGIN],
    methods: 'GET,PUT,POST,DELETE,PATCH,HEAD',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // enable set cookie
}));

app.use(express.json());

// Create a server
const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
    console.log("Web socket connection setup");
    yws.setupWSConnection(ws, req); // Automatically setup the connection with yjs
});

httpServer.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
})