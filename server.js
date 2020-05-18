const express = require("express");
const cors = require("cors");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.use(errorHandling);

function errorHandling(error, req, res, next) {
  console.error(error.e || error.err || error.error || error.errors || error);
  const { status, message } = error;
  res.status(status).json({ message });
}

module.exports = server;
