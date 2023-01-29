import mysql from "mysql2";
import * as dotenv from "dotenv"
dotenv.config()

const MYSQL = mysql.createConnection({
    host: process.env.DB_HOST,
    database:  process.env.DB_NAME,
    user:  process.env.DB_USER,
    password:  process.env.DB_PASS
});

MYSQL.connect(function(err){
    if (err) {
        return console.error(err);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

export default MYSQL