const Pokemon = require("../models/Pokemon");
const data = require("../utils/dataset");

class PokeToolController{
    async populate(req,res){
        data.map(async poke =>{
            let found = await Pokemon.findOne({name:poke.name})
            if(!found){
                let newPokemon = Pokemon({name:poke.name,ref:poke.url});
                await newPokemon.save();
            }
            
        });
        return res.status(200).json(data[0])
    }
}
module.exports = new PokeToolController();