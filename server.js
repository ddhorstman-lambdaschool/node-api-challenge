const express = require("express");
const cors = require("cors");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");
const errorHandling = require("./errors").errorHandling;


const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.use(errorHandling);


module.exports = server;
