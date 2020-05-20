const express = require("express");
const cors = require("cors");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");
const { custom404, errorHandling } = require("./errors");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.all("*", custom404);

server.use(errorHandling);

module.exports = server;
