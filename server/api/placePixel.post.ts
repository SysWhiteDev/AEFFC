import utils from "../utils/utils";

export default defineEventHandler(async (e) => {
    const body = await readBody(e);
    return new Promise(async (resolve, reject) => {
        await utils.db.query("INSERT INTO grid(x, y, color) VALUES($1, $2, $3) RETURNING *;", [body.x, body.y, body.color], (err, res) => {
            if (err) {
                reject({
                    "status": 'error',
                    "data": err
                });
            }
            resolve({
                "status": 'success',
                "data": res.rows[0]
            });
        });
    });
});