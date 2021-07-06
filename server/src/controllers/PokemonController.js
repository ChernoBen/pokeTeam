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
        if(req.query){
            if(req.query.attributes){
                let att = []
                att = att.concat(req.query.attributes.split(","));
                const attPokemons = await Pokemon.find({attributes:{$in:att}});
                if(attPokemons.length == 0) return res.status(404).json({message:"Not found"});
                return res.status(200).json({count:attPokemons.length,data:attPokemons});
            }else if(req.query._id){
                const id = ObjectId(req.query._id);
                const idPokemon = await Pokemon.findOne({_id:id});
                if(!idPokemon)return res.status(404).json({message:"Not found"});
                return res.status(200).json(idPokemon);
            }else if(req.query.name){
                const name = req.query.name;
                const pokeName = await Pokemon.find({name:name});
                if(!pokeName)return res.status(404).json({message:"Not found"});
                return res.status(200).json(pokeName);
            }else{
                const resul = await Pokemon.find();
                if(resul.length==0)return res.status(200).json([""]);
                return res.status(200).json({count:resul.length,data:resul});
            }
        }else{
            const result = await Pokemon.find();
            if(result.length==0)return res.status(200).json([""]);
            return res.status(200).json({count:result.length,data:result});
        } 
    }
}
module.exports = new PokemonController();
