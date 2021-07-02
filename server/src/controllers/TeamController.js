const jwt = require("jsonwebtoken");
const keys = require("../../keys");
const secret = keys.secret;
const Team = require("../models/Team");
const Pokemon = require("../models/Pokemon");
const data = require("../utils/dataset");

class TeamController{

    async create(req,res){
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized ." });
        let token = req.headers["authorization"];
        token = token.split(" ");
        let decoded = jwt.verify(token[1], secret);
        if (!decoded.id) return res.status(401).json({ message: "Unauthorized ." });
        if(!req.body.pokemons)return res.status(400).json({message:"Pokemon field can not be blank!"});
        if(req.body.pokemons.length>6 || req.body.pokemons.length<6)return res.status(400).json({message:"Pokemons must be 6!"});
        let dataSet = [];
        req.body.pokemons.map(async poke =>{
            try{
                let result = await Pokemon.findOne({name:poke});
                dataSet.push(result);
            }catch(error){
                return res.status(400).json({message:`Could not find ${poke}`});
            }
        });
        let pokeId = [];
        dataSet.map(async item =>{
            pokeId.push(item._id);
        });
        try{
            let register = Team({userId:decoded.id,Pokemons:pokeId});
            await register.save();
            return res.status(201).json(register);
        }catch(error){
            return res.status(500).json({message:"Internal Error"});
        }
    }
};
module.exports = new TeamController();