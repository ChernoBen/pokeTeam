const mongoose = require("../database");

const PokemonSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	attributes:[]
});
const Pokemon = mongoose.model("Pokemon", PokemonSchema);
module.exports = Pokemon;