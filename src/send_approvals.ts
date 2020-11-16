import {connect, Connection, ConfirmChannel, Channel, credentials}  from  'amqplib/callback_api';
import {Presentation} from "./dbcontroller"

// Connects to RabbitMQ

export function send(msg:Presentation){

connect('amqp://localhost', (error0, rabbitconnection)=>{
    if(error0){
        throw error0
    }else{
        console.log("sending")
    }
    rabbitconnection.createChannel((error1,channel)=>{
        if (error1) {
          throw error1;
        }

        const exchange = 'approvals';

        channel.assertExchange(exchange,"fanout", {
          durable: false
        });
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

      });
})

};