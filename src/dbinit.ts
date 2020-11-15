// You should not need to use this file, because the development database has been initialized on RDS

import {createConnection, QueryError, RowDataPacket} from 'mysql2';
import * as dotenv from "dotenv"
dotenv.config();
import * as bluebird from "bluebird"
import {createPresentation,state, getAllPresentations, getPresentation, modifyPresentationState} from "./dbcontroller"
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

    await connection.promise().query('DROP DATABASE IF EXISTS presentationproposals')
    .catch(console.log)
    .then(()=>{
        console.log("presentationproposals database dropped")
    });
    await connection.promise().query('CREATE DATABASE presentationproposals')
    .catch(console.log)
    .then(()=>{
        console.log("presentationproposals database created")
    });
    await connection.promise().query("USE presentationproposals")
    .catch(console.log)
    .then(()=>{
        console.log("presentationproposals database selected");
    })
    await connection.promise().query("CREATE TABLE presentations (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, event varchar(125), speakername varchar(125), email varchar(125), company varchar(125), title varchar(125), synopsis LONGTEXT, state enum('submitted', 'approved', 'not this year'))")
    .catch(console.log)
    .then(()=>{
        console.log("presentations table created")
    })

    await createPresentation(connection, {
        event:"sampleevent",
        email:"asdf@asdf.com",
        name:"asdfman",
        company:"asdfcompany",
        title:"asdftitle",
        synopsis:"this isa  syopsis of asdfasdfasdf asdftitle presentation",
        state:state.submitted
    })

    const presentations = await getAllPresentations(connection, "sampleevent");
    console.log("retreiving the presentations for sampleevent",presentations[0]);

    let presentation = await getPresentation(connection, "sampleevent", "asdftitle")
    console.log("retreiving the presentation asdftitle taking place at sampleevent", presentation[0]);

    await modifyPresentationState(connection,"sampleevent", "asdftitle",state.approved);
    presentation = await getPresentation(connection, "sampleevent", "asdftitle")
    console.log("presentation asdftitle at sampleevent should be approved", presentation[0]);

    await connection.end();
}
init();