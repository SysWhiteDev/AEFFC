import Express from "express";
import utils from "../utils/utils.js";

const getSettings = Express.Router();

getSettings.get("/", async (req, res) => {
  try {
    await utils.db.query("SELECT * FROM settings;", (err, row) => {
      if (err) {
        res.status(500).json({
          status: "error",
          data: err,
        });
      } else {
        res.json({
          status: "success",
          data: row.rows,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

export default getSettings;
