import utils from "../utils/utils";

export default defineEventHandler(async (e) => {
    const body = await readBody(e);
    if (body.length > 0) {
        return new Promise(async (resolve, reject) => {
            const promises = body.map(pixel => {
                return utils.db.query("INSERT INTO grid(x, y, color) VALUES($1, $2, $3) RETURNING *;", [pixel.x, pixel.y, pixel.color]);
            });
            try {
                await Promise.all(promises);
                resolve({
                    "status": 'success',
                });
            } catch (err) {
                reject({
                    "status": 'error',
                });
            }
        });
    } else {
        return {
            "status": 'error',
            "data": "No body"
        };
    }
});
