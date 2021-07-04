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
let pokeChange={
    id:"",
    pokemons:[
        "ivysaur",
        "charmander",
    ],
    newPokemons:[
        "beedrill",
        "pidgey",
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
    test("Should register a new team",()=>{
        return request.post("/team")
            .set({authorization:authToken})
            .send(mainTeam)
            .then(res=>{
                pokeChange.id = res.body["_id"];
                expect(res.statusCode).toEqual(201);
            })
            .catch(error=>{
                fail(error);
            });
    });

    test("Should update a team",()=>{
        return request.put("/team")
            .set({authorization:authToken})
            .send(pokeChange)
            .then(res=>{
                expect(res.statusCode).toEqual(200);
            })
            .catch(error=>{
                fail(error);
            });
    });
    
    test("Should delete a team",()=>{
        return request.delete("/team")
            .set({authorization:authToken})
            .query({id:pokeChange.id})
            .then(res=>{
                expect(res.statusCode).toEqual(202);
            })
            .catch(error=>{
                fail(error);
            });
    });
    
    
});

describe("PokeTeam wrong entrys test suite",()=>{
    test("Should prevent empty entry",()=>{
        return request.post("/team")
            .set({authorization:authToken})
            .send({pokemons:""})
            .then(res=>{
                expect(res.statusCode).toEqual(400);
            })
            .catch(error=>{
                fail(error);
            });
    });
    
    test("Should prevent wrong pokemon names entry",()=>{
        return request.post("/team")
            .set({authorization:authToken})
            .send({pokemons:[
                `1-${Date.now()}`,
                `2-${Date.now()}`,
                `3-${Date.now()}`,
                `4-${Date.now()}`,
                `5-${Date.now()}`,
                `6-${Date.now()}`
            ]})
            .then(res=>{
                expect(res.statusCode).toEqual(404);
            })
            .catch(error=>{
                fail(error);
            });
    });

    test("Should prevent user delete another user team",()=>{
        mainUser.email = `another${Date.now()}@gmail.com`;
        mainUser.password = `${Date.now()}`;
        mainUser.name = `anotherName-${Date.now()}`
        return request.post("/user")
        .send(mainUser)
        .then(res => {
            expect(res.statusCode).toEqual(201);
            return request.post("/auth")
                .send({ email: mainUser.email, password: mainUser.password })
                .then(res => {
                    expect(res.statusCode).toEqual(200);
                    authToken = res.body.token;
                    return request.delete("/team")
                        .set({authorization:authToken})
                        .query({id:pokeChange.id})
                        .then(res=>{
                            expect(res.statusCode).toEqual(404);
                        })
                        .catch(error=>{
                            fail(error);
                        });

                })
                .catch(error=>{
                    fail(error);
                });
        })
        .catch(error=>{
            fail(error);
        });
    });
});