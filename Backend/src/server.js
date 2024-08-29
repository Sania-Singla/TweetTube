require("dotenv").config();                                                         // will we available to all the invoked methods
const app = require("./app");
const Connect_DB = require("./db/connection");

const PORT= process.env.PORT || 4000;


Connect_DB()        // async function so will return a promise
.then( ()=>{
    app.listen( PORT, () => { console.log(`server is listening on port ${PORT} ...`) })
})