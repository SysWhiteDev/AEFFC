import Express from "express";
import utils from "../utils/utils.js";

const getGrid = Express.Router();

getGrid.get("/", async (req, res) => {
  try {
    const row = await utils.db.query("SELECT * FROM grid;");
    res.json({
      status: "success",
      data: row.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

export default getGrid;
