import {connect, Connection, ConfirmChannel, Channel, credentials}  from  'amqplib/callback_api';



export function receive(){
connect('amqp://localhost', (error0, connection) =>{
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) =>{
    if (error1) {
      throw error1;
    }
    const exchange = "events"

    channel.assertExchange(exchange, 'fanout', {durable:false});

    channel.assertQueue('', {
      exclusive:true
    }, (error2,q)=>{
      if(error2){
        throw error2;
      }
      channel.bindQueue(q.queue,exchange,'');

      channel.consume(q.queue, (msg)=>{
        if(msg.content){
          console.log(" [x] %s", msg.content.toString());
        }
      },{
        noAck:true
      })

    })


  });
})

};