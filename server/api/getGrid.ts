import utils from "../utils/utils"

export default defineEventHandler(async () => {
    const res = await utils.db.query("SELECT * FROM grid;");
    return {
        "status": 'success',
        "data": res.rows
    };
});
