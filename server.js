const express = require("express");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

const server = express();
server.use(express.json());

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.use(errorHandling);

function errorHandling(error, req, res, next) {
  console.error(error.e || error.err || error.error || error);
  const { status, message } = error;
  res.status(status).json({ message });
}

module.exports = server;
