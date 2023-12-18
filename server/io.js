import db from "./utils/db.js";

export default function svc(socket, io) {
  io.on("connection", () => {
    socket.broadcast.emit("userCount", io.engine.clientsCount);
  });
  return Object.freeze({
    disconnect() {
      socket.broadcast.emit("userCount", io.engine.clientsCount);
    },
    setPlace(data) {
      db.query(
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
    },
  });
}
