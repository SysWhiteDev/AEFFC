import Express from "express";
import utils from "../utils/utils.js";

const getSettings = Express.Router();

getSettings.get("/", async (req, res) => {
  utils.db.hgetall("settings", (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        data: "An error occurred while retrieving settings",
      });
    } else {
      res.json({
        status: "success",
        data: reply,
      });
    }
  });
});

export default getSettings;
