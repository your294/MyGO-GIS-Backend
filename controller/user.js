const database = require("./database");
const Mock = require("mockjs");

database.connection.queryAsync = function (sql, params, callback) {
  return new Promise((resolve, reject) => {
    this.query(sql, params, (error, results, fields) => {
      if (error) {
        // from pending to rejected
        reject(error);
      } else {
        // from pending to resolved
        resolve(results);
      }

      if (callback) {
        callback(error, results, fields);
      }
    });
  });
};

async function listUsers(ctx) {
  const columns = ["userAccount", "userName", "userProfile", "userAvatar"];
  const sql = "SELECT ?? from ?? where userRole = ?";
  try {
    results = await database.connection.queryAsync(sql, [
      columns,
      "gis_user",
      "user",
    ]);
    for (let i = 0; i < results.length; i++) {
      const m = Mock.mock({
        intro: "@csentence",
        email: /[a-z]{5}@163.com/,
        telephone: /1[35789]\d{9}/,
      });
      results[i]["intro"] = m.intro;
      results[i]["email"] = m.intro;
      results[i]["telephone"] = m.telephone;
      results[i]["tags"] = [`保安${i + 1}号`];
    }
    for (let i = 0; i < 5; i++) {
      const arr = ["保安", "巡查外部路线", "巡查内部路线"];
      results.push(
        Mock.mock({
          userAccount: "@cname",
          userName: "@cname",
          intro: "@csentence",
          email: /[a-z]{5}@163.com/,
          telephone: /1[35789]\d{9}/,
          tags: arr,
        })
      );
    }
    ctx.body = results;
  } catch (error) {
    throw error;
  }
}

async function UserLogin(ctx) {
  const userName = ctx.request.body.username;
  const password = ctx.request.body.password;
  const sql = "SELECT * from ?? where userAccount = ? and userPassword = ?";
  try {
    const results = await database.connection.queryAsync(sql, [
      "gis_user",
      userName,
      password,
    ]);
    if (results.length > 0) {
      ctx.body = results[0];
    } else {
      throw new Error("用户不存在");
    }
  } catch (error) {
    console.error(error);
    ctx.body = "用户不存在";
  }
}

module.exports = {
  listUsers,
  UserLogin,
};
