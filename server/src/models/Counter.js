const mongoose = require("../database");

const CounterSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	effective:[],
	weakness:[]
});
const Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;