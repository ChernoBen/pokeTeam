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
app.listen(3000,async ()=>{
    try{
        const worker = await axios.get("http://worker:5000/worker");     
    }catch(error){
        console.log("Connection error while pulling the worker trigger")
    }
    console.log("Server running...");
});