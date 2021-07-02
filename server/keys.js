//module.exports = {
//	apiPort:process.env.API_PORT,
//	secret:process.env.SECRET,
//	mgHost: process.env.HOST,
//	mgDatabase: process.env.MONGO_INITDB_DATABASE,
//	mgPort: process.env.ME_CONFIG_MONGODB_PORT,
//	url:"https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
//};
module.exports = {
    apiPort:"3000",
    secret:"jhkshdkjsdkjh",
    mgHost: "localhost",
    mgDatabase: "test",
    mgPassword: process.env.ME_CONFIG_MONGODB_ADMINPASSWORD,
    mgPort: "27017"
};