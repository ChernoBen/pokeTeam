const mongoose = require("../database");
const axios = require("axios");
const keys = require("../../keys");

const PokemonSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	ref:{
		type:String,
		required:true
	}
});
const Pokemon = mongoose.model("Pokemon", PokemonSchema);
module.exports = Pokemon;