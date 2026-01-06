import express from 'express';
import http from 'node:http';
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from 'cors';
import path from 'node:path';

const server = http.createServer();
const app = express(server);
const __dirname = process.cwd();
const bareServer = createBareServer('/bare/');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Express 5 routing: use a regex for wildcard matching to avoid path-to-regexp errors
app.get(/^\/scramjet\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen({ port: PORT }, () => {
    console.log("Server listening on port " + PORT);
});

process.on("SIGINT", () => {
    server.close();
    bareServer.close();
    process.exit(0);
});
