import express from "express";
const app = express();
const port = 8080; // default port to listen
import {config} from "dotenv";
import { resolve } from "path";
config({path:resolve(__dirname,".env")})
import {connect, Connection, ConfirmChannel, Channel, credentials}  from  'amqplib/callback_api';


// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
const server = app.listen( port, () => {
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

    console.log( `server started at http://localhost:${ port }` );
} );
