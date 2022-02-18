const { JsonWebTokenError } = require("jsonwebtoken");
const { rd_client } = require("../../adapters/database/redis");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const powerGet = async (req, res) => {
  // the token is if  find in redis token list  then gets temperature data from redis db.
  // If the token is invalid, the middleware terminates the request.

  const { refreshToken } = req.body;
  let lastEl=parseInt(req.body.lastEl,10);  //req.lastEl
  let userId = req.userId; // from middleware

  console.log("req.userId: ",userId, lastEl);

  await rd_client.GET(userId.toString())
  .then(async (redis_res) => {
    console.log(redis_res);

    let rd_token = JSON.parse(redis_res);
    // the token is if  find in redis token list  then gets temperature data from redis db.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      // key, start, end = ..., -1, -10 => last 10 elements
      await rd_client.LRANGE("power-group2", 0, lastEl)  // 0,-1 all list 
      .then((res_rd)=>{
        res.status(200).send(res_rd);
      });
    }
  }).catch((err) => {
    console.log(err);
    res.send("user not found :"+err);
    res.end();

    const errData = {
      flag_type: 1,
      req_src: "reader-api",
      req_path: "/electiricity",
      req_file: "electricity.js",
      req_line: 31,
      req_func: "powerGet",
      req_type: "Controller",
      req_raw: req.body,
      content_err: JSON.stringify(err),
      content_message: err.message,
      is_solved: 0,
      is_notified: 0,
      is_assgined: "name",
    };
    errToPostLogApi(errData);
  });
};

module.exports = {
  powerGet,
};
