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
        let pokeId = await Pokemon.find({name:req.body.pokemons}).select("_id");
        let ids = pokeId.map(item=>{
            return item._id;
        });
        try{
            let register = Team({userId:decoded.id,pokemons:ids});
            await register.save();
            return res.status(201).json(register);
        }catch(error){
            return res.status(500).json({message:"Internal Error"});
        }
    }

    async update(req,res){
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized ." });
        let token = req.headers["authorization"];
        token = token.split(" ");
        let decoded = jwt.verify(token[1], secret);
        if (!decoded.id) return res.status(401).json({ message: "Unauthorized ." });
        let {pokemons,newPokemons,id} = req.body;
        if(!pokemons || !newPokemons)return res.status(400).json({message:"Fields can not be blank!"});
        if(pokemons.length == 0 || pokemons.length >6 || newPokemons.length == 0 || newPokemons.length >6){
            return res.status(400).json({message:"Invalid setup os pokemons"});
        }
        if(pokemons.length != newPokemons.length)return res.status(400).json({message:"Fields should have the same number of items"})
        let team = await Team.findOne({_id:id}).select("pokemons");
        let pokeSet = await Pokemon.find({name:{$in:pokemons}});
        if(pokeSet.length < pokemons.length)return res.status(400).json({message:`Could not find ${newPokemons}`});
        let newPokeSet = await Pokemon.find({name:{$in:newPokemons}});
        if(newPokeSet.length < newPokemons.length)return res.status(400).json({message:`Could not find ${newPokemons}`});
        let data=[];
        let i = 0;
        pokeSet.map(item=>{
            team.pokemons[team.pokemons.indexOf(item)] = newPokeSet[i]._id;
            i+=1;
        });
        data = team.pokemons;
        await Team.findByIdAndUpdate(
            { _id:id },
            { pokemons:data },
            { new: true },
            async (err, team) => {
                if (err) return res.status(500);
                let result = await Pokemon.find({_id:{$in:data}});
                return res.status(200).json(result);
            });
    }
};
module.exports = new TeamController();