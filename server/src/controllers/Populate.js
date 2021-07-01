const Pokemon = require("../models/Pokemon");
const data = require("../utils/dataset");

class PokeToolController{
    async populate(req,res){
        console.log(data[0])
        data.map(async poke =>{
            let newPokemon = Pokemon({name:poke.name,ref:poke.url});
            await newPokemon.save();
        });
        return res.status(200).json(data[0])
    }
}
module.exports = new PokeToolController();