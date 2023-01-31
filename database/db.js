import mysql from "mysql2";
import * as dotenv from "dotenv"
dotenv.config()

const MYSQL = mysql.createPool({
    connectionLimit: 1000,
    host: process.env.DB_HOST,
    database:  process.env.DB_NAME,
    user:  process.env.DB_USER,
    password:  process.env.DB_PASS
});

MYSQL.getConnection(function(err, connection) {
    if (err) {
        console.error(err);
    }
    else{
        connection.connect(function(err){
            if(err){
                console.error(err);
            }else {
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });

    }
    return connection.release();
})


export default MYSQL