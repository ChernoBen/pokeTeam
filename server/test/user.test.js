const express = require("express");
const app = express();
const router = require("../src/app");
const supertest = require("supertest");
const { auth } = require("../src/controllers/UserController");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const request = supertest(app.listen(3002, () => {
	console.log("User tests...");
}));

let mainUser = {
    name:`Name-${Date.now()}`,
    email:`email${Date.now()}@gmail.com`,
    password:`Pass-${Date.now()}`
};
let authToken = "";

describe("User test suite", () => {
	test("Should register a new user with success .", () => {
		return request.post("/user")
			.send(mainUser)
			.then(res => {
                mainUser._id = res.body._id;
				expect(res.statusCode).toEqual(201);
			})
			.catch(error => {
				fail(error);
			});
	});

	test("Should prevent empty data entry by user .", () => {
		let user = {
			name: "",
			email: "",
			password: ""
		};
		return request.post("/user")
			.send(user)
			.then(res => {
				expect(res.statusCode).toEqual(400);
			})
			.catch(error => {
				fail(error);
			});
	});

    test("Should get auth token",()=>{
        return request.post("/auth")
            .send({email:mainUser.email,password:mainUser.password})
            .then(res=>{
                authToken = res.body.token;
                expect(res.statusCode).toEqual(200);
            })
            .catch(error=>{
                fail(error);
            });
    });

});