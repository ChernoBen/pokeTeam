const jwt = require("jsonwebtoken");
const keys = require("../../keys");
const secret = keys.secret;
const Team = require("../models/Team");
const Pokemon = require("../models/Pokemon");
const User = require("../models/User");
const { ObjectId } = require('mongodb');

class TeamController{

    async create(req,res){
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized ." });
        let token = req.headers["authorization"];
        token = token.split(" ");
        const decoded = jwt.verify(token[1], secret);
        if (!decoded.id) return res.status(401).json({ message: "Unauthorized ." });
        if(!req.body.pokemons)return res.status(400).json({message:"Pokemon field can not be blank!"});
        if(req.body.pokemons.length>6 || req.body.pokemons.length<6)return res.status(400).json({message:"Pokemons must be 6!"});
        req.body.pokemons.map(async poke =>{
            try{
                let result = await Pokemon.findOne({name:poke});
                if(!result)return res.status(404).json({message:`Could not find ${poke}`})
            }catch(error){
                return res.status(500).json({message:`Error while trying to verify actual pokemons`});
            }
        });
        const pokeId = await Pokemon.find({name:req.body.pokemons}).select("_id");
        const ids = pokeId.map(item=>{
            return item._id;
        });
        const isValid = await Team.findOne({userId:ObjectId(decoded.id)});
        if(isValid)return res.status(400).json({message:"User already have a team!"});
        const register = Team({userId:ObjectId(decoded.id),pokemons:ids});
        await register.save();
        const pokeTeam = await Pokemon.find({_id:{$in:ids}});
        return res.status(201).json({
            _id:register._id,
            user:decoded.name,
            team:pokeTeam
        });
        
    }

    async update(req,res){
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized ." });
        let token = req.headers["authorization"];
        token = token.split(" ");
        const decoded = jwt.verify(token[1], secret);
        if (!decoded.id) return res.status(401).json({ message: "Unauthorized ." });
        let {pokemons,newPokemons} = req.body;
        if(!pokemons || !newPokemons)return res.status(400).json({message:"Fields can not be blank!"});
        if(pokemons.length == 0 || pokemons.length >6 || newPokemons.length == 0 || newPokemons.length >6){
            return res.status(400).json({message:"Invalid setup os pokemons"});
        }
        if(pokemons.length != newPokemons.length)return res.status(400).json({message:"Fields should have the same number of items"})
        let team = await Team.findOne({userId:ObjectId(decoded.id)}).select("pokemons");
        let pokeSet = await Pokemon.find({name:{$in:pokemons}});
        if(pokeSet.length < pokemons.length)return res.status(400).json({message:`Could not find ${newPokemons}`});
        let newPokeSet = await Pokemon.find({name:{$in:newPokemons}});
        if(newPokeSet.length < newPokemons.length)return res.status(400).json({message:`Could not find ${newPokemons}`});
        let data=[];
        let i = 0;
        pokeSet.map(item=>{
            team.pokemons[team.pokemons.indexOf(item._id)] = newPokeSet[i]._id;
            i+=1;
        });
        data = team.pokemons;
        await Team.findByIdAndUpdate(
            { _id:ObjectId(team._id) },
            { pokemons:data },
            { new: true },
            async (err, team) => {
                if (err) {
                    return res.status(500).json({message:"Internal Error!"});
                }
                let result = await Pokemon.find({_id:{$in:data}});
                return res.status(200).json(result);
            });
    }

    async get(req,res) {
        if (!req.headers["authorization"]) return res.status(401).json({ message: "Unauthorized ." });
        let token = req.headers["authorization"];
        token = token.split(" ");
        const decoded = jwt.verify(token[1], secret);
        if(!decoded.id)return res.status(401).json({message:"Unauthorized"});
        let result = await Team.findOne({userId:decoded.id});
        if(result == null){ 
            return res.status(200).json({pokemons:[""]});
        }
        const {pokemons,userId} = result;
        const team = await Pokemon.find({_id:{$in:pokemons}}).select("name");
        const user = await User.findOne({_id:ObjectId(userId)}).select("name"); 
        return res.status(200).json({_id:result._id,user:user.name,team});
	}

    async delete(req, res) {
		if (!req.headers["authorization"]) return res.status(401);
		const token = req.headers["authorization"];
		if (req.query.id) {
			const id = req.query.id;
			if (token) {
				const bearer = token.split(" ");
				const tk = bearer[1];
				const decoded = jwt.verify(tk, secret);
				const result = await Team.findOne({userId: decoded.id});
                if(!result.pokemons){
                    return res.status(404).json({message:"Team not found!"});
                }
                await Team.deleteOne({_id:ObjectId(id)})
                return res.status(202).json({message:"Team succefully deleted!"})   
			} else {
				return res.status(401);
			}
		} else {
			return res.status(400);
		}
	}
};
module.exports = new TeamController();