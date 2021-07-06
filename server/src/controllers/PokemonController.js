const jwt = require("jsonwebtoken");
const keys = require("../../keys");
const secret = keys.secret;
const Team = require("../models/Team");
const Pokemon = require("../models/Pokemon");
const User = require("../models/User");
const Counter = require("../models/Counter");
const { ObjectId } = require('mongodb');

class PokemonController{
    async get(req,res) {
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized" });
        let token = req.headers["authorization"];
        token = token.split(" ");
        const decoded = jwt.verify(token[1], secret);
        if(!decoded)return res.status(401).json({message:"Unauthorized"})
        if(!decoded.id)return res.status(401).json({message:"Unauthorized"});
        let query = {
            _id:req.query._id,
            attributes:req.query.attributes?req.query.attributes.split(","):undefined,
            name:req.query.name
        };
        for (var [key,value] of Object.entries(query)) { if (!req.query[key]) { delete query[key]; } }
        if(query == undefined){
            let counts = await Pokemon.find().countDocuments();
            let pokeData = await Pokemon.find();
            return res.status(200).json({count:counts,data:pokeData}); 
        }
        let result = await Pokemon.find(query);
        if(result.length == 0 || result == undefined || result == "" || result == null)return res.status(404).json({message:"Pokemon not found"});
        let counter = await Pokemon.find(query).countDocuments();
        return res.status(200).json({count:counter,data:result});
    }
}
module.exports = new PokemonController();
