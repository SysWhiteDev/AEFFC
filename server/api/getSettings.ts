import utils from "../utils/utils"

export default defineEventHandler(async () => {
    return new Promise(async (resolve, reject) => {
        await utils.db.query("SELECT * FROM settings;", (err, res) => {
            if (err) {
                reject({
                    "status": 'error',
                    "data": err
                });
            }
            resolve({
                "status": 'success',
                "data": res
            });
        });
    });
});
