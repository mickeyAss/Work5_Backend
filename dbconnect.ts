import mysql from "mysql";

export const conn = mysql.createPool({
    connectionLimit: 10,
    host: "sql6.freemysqlhosting.net",
    user: "sql6689649",
    password: "iMQFciNk9H",
    database: "sql6689649",
})