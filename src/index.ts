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
connect('amqp://localhost', (error0, rabbitconnection)=>{
    if(error0){
        throw error0
    }else{

        console.log("Horray. We connected to RabbitMQ")
    }
    rabbitconnection.createChannel((error1,channel)=>{
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
const connection = createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database:"presentationproposals",
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

app.use(express.urlencoded({type:"application/x-www-form-urlencoded"}))
import {createPresentation,state, getAllPresentations, getPresentation, modifyPresentationState} from "./dbcontroller"

// This endpoint retrieves a single presentation.
app.get("/presentation", async (req,res)=>{
    const data = await getPresentation(connection,req.body.event,req.body.title)
    res.send(data[0])
})

// This endpoint creates a presentation.
app.post("/presentation",async (req,res)=>{
    const data = await createPresentation(connection,req.body)
    res.send(req.body.event)
})

// This endpoint retrieves a list of all the presentations.
app.get("/allpresentations",async (req,res)=>{
    const data = await getAllPresentations(connection,req.body.event)
    res.send(data[0])
})

// This endpoint changes the state of an existing presentation proposal
app.patch("/presentation",()=>{
    console.log("changes the state of a presentation")
})


// start the Express server
const server = app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
