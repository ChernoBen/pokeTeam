const mongoose = require("../database");

const TeamSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    pokemons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemons',
            required:true
        }
    ]
});
const Team = mongoose.model("Team",TeamSchema);
module.exports = Team;
