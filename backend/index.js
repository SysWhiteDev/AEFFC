import cors from "cors";
import Express from "express";
import compression from "compression";
import { Server } from "socket.io";
import utils from "./utils/utils.js";
import "dotenv/config";
import { createServer } from "http";

const app = Express();
app.use(compression({ level: 9 }));
app.use(Express.json());
app.use(cors());
const httpServer = createServer(app);

/* get canvas size values */
let maxX;
let maxY;
utils.db.hgetall("settings", (err, reply) => {
  maxX = reply.canvaswidth;
  maxY = reply.canvasheight;
});

/* express */
app.get("/", (req, res) => {
  res.send("AEFFC API v0.1 by SysWhite");
});

import getSettings from "./api/getSettings.js";
app.use("/api/getSettings", getSettings);
import getGrid from "./api/getGrid.js";
app.use("/api/getGrid", getGrid);

/* socket */
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

function forceDisconnect(socket) {
  if (socket) {
    socket.disconnect();
    socket.broadcast.emit("userCount", io.engine.clientsCount);
  }
}

io.on("connection", (socket) => {
  utils.db.set("ws_active_connections", io.engine.clientsCount);
  socket.emit("userCount", io.engine.clientsCount);
  setInterval(() => {
    socket.emit("userCount", io.engine.clientsCount);
  }, 1000);
  socket.on("disconnect", () => {
    socket.broadcast.emit("userCount", io.engine.clientsCount);
    utils.db.set("ws_active_connections", io.engine.clientsCount);
  });
  socket.on("setPlace", (data) => {
    // forceDisconnect(socket);
    if (data.x > maxX || data.y > maxY || data.x < 0 || data.y < 0) return;
    utils.db.hset(
      "pixelgrid",
      `${data.x},${data.y}`,
      data.color,
      function (err, response) {
        if (err) throw err;
        socket.broadcast.emit("getPlace", data);
      }
    );
  });
});

httpServer.listen(process.env.BACKEND_PORT, () => {
  console.log(`[SERVER] Listening on port ${process.env.BACKEND_PORT}`);
});
