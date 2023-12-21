import Express from "express";
import utils from "../utils/utils.js";

const getGrid = Express.Router();

getGrid.get("/", async (req, res) => {
  utils.db.hgetall("pixelgrid", (err, reply) => {
    if (err) {
      res.status(500).json({ error: "An error occurred while fetching data" });
      return;
    }
    res.json({
      status: "success",
      data: reply,
    });
  });
});

export default getGrid;
