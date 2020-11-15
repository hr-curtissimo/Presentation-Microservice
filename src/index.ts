import express from "express";
const app = express();
const port = 8080; // default port to listen
import {config} from "dotenv";
import { resolve } from "path";
config({path:resolve(__dirname,".env")})
import {connect, Connection, ConfirmChannel, Channel, credentials}  from  'amqplib/callback_api';
import {createConnection, QueryError, RowDataPacket} from 'mysql2';
import * as dotenv from "dotenv"
dotenv.config();
import * as bluebird from "bluebird"


// Connects to RabbitMQ
connect('amqp://localhost', (error0, connection)=>{
    if(error0){
        throw error0
    }else{

        console.log("Horray. We connected to RabbitMQ")
    }
    connection.createChannel((error1,channel)=>{
        if (error1) {
          throw error1;
        }else{

            console.log("Horray. We created a channel")
        }
        const queue = 'hello';
        const msg = 'Hello world';

        channel.assertQueue(queue, {
          durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
});

// Connects to database

async function dbConnect(){
    const connection = await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database:"mysql",
        Promise:bluebird
    });
    connection.connect((err)=>{
        if (err) {
          console.error('error connecting to database: ' + err.stack);
          return;
        }
        console.log("horray, connected to database")
        console.log('connected as id ' + connection.threadId);
    });
    return connection
}

const conn = dbConnect()


// hello world endpoint
app.get( "/hello", ( req, res ) => {
    res.send( "Hello world!" );
} );
// This endpoint retrieves a single presentation.
app.get("/presentation",(req,res)=>{
console.log("retrieves a presentation")
})


// This endpoint creates a presentation.
app.post("/presentation",(req,res)=>{
console.log("creates a presentation");
})

// This endpoint retrieves a list of all the presentations.
app.get("/presentationlist",()=>{
    console.log("retrieves presentation list")
})

// This endpoint changes the state of an existing presentation proposal
app.post("/statechange",()=>{
    console.log("changes the state of a presentation")
})




// start the Express server
const server = app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
