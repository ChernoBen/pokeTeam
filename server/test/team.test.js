const express = require("express");
const app = express();
const router = require("../src/app");
const supertest = require("supertest");
const url = require("../keys");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const request = supertest(app.listen(3003, () => {
	console.log("User tests...");
}));

let mainUser = {
    name:`Name-${Date.now()}`,
    email:`email${Date.now()}@gmail.com`,
    password:`Pass-${Date.now()}`
};
let authToken = "";
let mainTeam = { 
    pokemons:[
        "bulbasaur",
        "ivysaur",
        "charmander",
        "charizard",
        "wartortle",
        "squirtle",
    ]
};
beforeAll(() => {
    return request.post("/user")
        .send(mainUser)
        .then(res => {
            return request.post("/auth")
                .send({ email: mainUser.email, password: mainUser.password })
                .then(res => {
                    authToken = res.body.token;
                });
        });
});

describe("Pokemon test suite",()=>{
    test("Should register a new pokemon",()=>{
        return request.post("/team")
            .set({authorization:authToken})
            .send(mainTeam)
            .then(res=>{
                console.log(res.body);
                expect(res.statusCode).toEqual(201);
            })
            .catch(error=>{
                fail(error);
            });
    });
});