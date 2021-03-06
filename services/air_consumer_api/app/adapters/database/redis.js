const { createClient } = require('redis');
const errorCatch = require("../../middleware/errorMiddleware");
const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
const url = `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_INDEX}`
console.log(url)
rd_client = createClient({ url: url})

rd_client.on('connect', () => {
    console.log('::> Redis Server is Ready')
});

rd_client.on('error', (err) => {
    const errData = {
        flag_type: 1,
        req_src: "consumer-air-api",
        req_path: "/",
        req_file: "redis.js",
        req_line: 13,
        req_func: "redis",
        req_type: "Database",
        content_message: err.message,
        content_err: err,
        is_solved: 0,
        is_notified: 0,
        is_assigned: "name",
    };
    errorCatch(errData)
});

(async () => {
    await rd_client.connect()
})();

exports.rd_client = rd_client