import express from "express";
const app = express();
const port = 8080; // default port to listen
import {config} from "dotenv";
import { resolve } from "path";
config({path:resolve(__dirname,".env")})
// import {connect, Connection, ConfirmChannel, Channel, credentials}  from  'amqplib/callback_api';
import {send} from "./send_approvals.js";
import {receive} from "./receive_events.js"
import {createConnection, QueryError, RowDataPacket} from 'mysql2';

import * as dotenv from "dotenv"
dotenv.config();
import * as bluebird from "bluebird"


// starts the rabbitmq channels

receive();
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
        console.log('connected as id ' + connection.threadId);
});

app.use(express.urlencoded({type:"application/x-www-form-urlencoded"}))
import {createPresentation,state, getAllPresentations, getPresentation, modifyPresentationState} from "./dbcontroller"

// Check the readme for more details on how to use these endpoints.

// This endpoint retrieves a single presentation.
app.get("/presentation", async (req,res)=>{
    const data = await getPresentation(connection,req.body.event,req.body.title)
    res.send(data[0])
})

// This endpoint creates a presentation.
// Right now, it will create a presentation without checking if one already exists at the event with the same title
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
app.patch("/presentation",async (req,res)=>{
    if(req.body.newstate ==="submitted" || req.body.newstate ==="approved" || req.body.newstate === "not-this-year"){
        const data = await modifyPresentationState(connection,req.body.event,req.body.title,req.body.newstate)
        if(req.body.newstate === "approved"){
            const tobesent = await getPresentation(connection,req.body.event,req.body.title);
            send(tobesent[0])
        }
        res.send("success")
    }else{
        res.send("fail")
    }
})

// start the Express server
const server = app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
