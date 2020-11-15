import {createConnection, QueryError, RowDataPacket} from 'mysql2';
import * as dotenv from "dotenv"
dotenv.config();
import * as bluebird from "bluebird"

async function init(){
    const connection = await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database:"mysql",
        Promise:bluebird
    });
    connection.connect((err)=>{
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }

        console.log('connected as id ' + connection.threadId);
    });

    await connection.promise().query('DROP DATABASE IF EXISTS presentationproposals').catch(console.log).then(()=>{
        console.log("presentationproposals database dropped")
    });
    await connection.promise().query('CREATE DATABASE presentationproposals').catch(console.log).then(()=>{
        console.log("presentationproposals database created")
    });
    await connection.promise().query("USE presentationproposals").catch(console.log).then(()=>{
        console.log("presentationproposals database selected");
    })
    await connection.promise().query("CREATE TABLE presentations (name varchar(125), email varchar(125), company varchar(125), title varchar(125), synopsis LONGTEXT, state enum('submitted', 'approved', 'not this year'))").catch(console.log).then(()=>{
        console.log("presentations table created")
    })
    await connection.end();
}
init();