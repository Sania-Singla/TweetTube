require("dotenv").config();                                                         // will we available to all the invoked methods
const app = require("./app");

const PORT= process.env.PORT || 4000;

const Connect_DB = require("./db/connection");


Connect_DB()        // async function so will return a promise
.then( ()=>{
    app.listen( PORT, () => { console.log(`server is listening on port ${PORT} ...`) })
})