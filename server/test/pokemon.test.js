const express = require("express");
const app = express();
const router = require("../src/app");
const supertest = require("supertest");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const request = supertest(app.listen(3004, () => {
	console.log("Pokemon tests...");
}));

let mainUser = {
    name:`Name-${Date.now()}`,
    email:`email${Date.now()}@gmail.com`,
    password:`Pass-${Date.now()}`
};
let authToken = "";
let attributes = ["grass","poison"]
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
    test("Should get pokemons without passing attributes",()=>{
        return request.get("/pokemon")
            .set({authorization:authToken})
            .then(res=>{
                expect(res.statusCode).toEqual(200);
            })
            .catch(error=>{
                fail(error);
            });
    });

    test("Should not get pokemons by passing attributes",()=>{
        attributes[0]= "wrong";
        return request.get(`/pokemon?attributes=${attributes[0]}`)
            .set({authorization:authToken})
            .then(res=>{
                expect(res.statusCode).toEqual(404);
            })
            .catch(error=>{
                fail(error);
            });
    });
});
