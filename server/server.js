const express = require("express");
const app = express();
const routes = require("./src/app");
const keys = require("./keys");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const axios = require("axios");

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

const options = {
    customCss:"swagger-ui .topbar { display:none }",
    customSiteTitle: "PokéTeam-API",
	explorer: true
};

app.use("/doc",swaggerUi.serve,swaggerUi.setup(swaggerFile,options));
app.use(routes);
setTimeout(()=>{console.log("Waiting for the worker start")},60000)
app.listen(3000,async ()=>{
    try{
        const worker = await axios.get("http://worker:5000/worker");
        setTimeout(()=>{console.log("Waiting for the worker response")},60000)
        if(worker){
            if(!worker.message){
                if(worker.data["local-count"] == worker.data["web-count"]){
                    console.log("Data base is updated");
                }else{
                    console.log(`Pokemons on database:${worker.data["local-count"]}\n Pokemons on web:${worker.data["web-count"]}`);
                }
            }else{
                console.log(worker.message);
            }
            
        }      
    }catch(error){
        console.log("Error while pulling the worker trigger")
    }
    console.log("Server running...");
});