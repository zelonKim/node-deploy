require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD, // 데이터 베이스 비밀번호
    database: 'nodebird',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird', 
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false, // 배포환경일 경우에는 logging: false를 통해 쿼리 명령어를 숨김.
  },
};