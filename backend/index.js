import cors from "cors";
import Express from "express";
import { Server } from "socket.io";
import utils from "./utils/utils.js";
import { createServer } from "http";

const app = Express();
app.use(Express.json());
app.use(cors());
const httpServer = createServer(app);

/* express */
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

io.on("connection", (socket) => {
  setInterval(() => {
    socket.broadcast.emit("userCount", io.engine.clientsCount);
  }, 1000);
  socket.on("disconnected", () => {
    console.log("DISCONNECTED");
    socket.broadcast.emit("userCount", io.engine.clientsCount);
  });
  socket.on("setPlace", (data) => {
    utils.db.query(
      "INSERT INTO grid(x, y, color) VALUES($1, $2, $3) RETURNING *;",
      [data.x, data.y, data.color],
      (err, res) => {
        if (err) {
          return;
        }
        socket.broadcast.emit("getPlace", data);
        return { success: true };
      }
    );
  });
});

httpServer.listen(3001, () => {
  console.log("[SERVER] Listening on port 3001");
});
