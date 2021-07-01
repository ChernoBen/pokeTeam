const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const keys = require("../../keys");
const JWTSecret = keys.secret;
const User = require("../models/User");

class UserController {

	async create(req, res) {
		const { name, email, password} = req.body;
		if (name == "" || email == "" || password == "") return res.sendStatus(400);
		if (!validator.validate(email)) return res.status(400);
		if (password.length < 8) return res.status(400);
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(password, salt);
		try {
			const user = await User.findOne({ "email": email });
			if (user != undefined) { return res.status(400).json({ error: "Email already registered" }); }
			const newUser = new User({ name, email, password: hash});
			await newUser.save();
			res.status(201).json( newUser);
		} catch (error) {
			res.status(500);
		}
	}

	async auth(req, res) {
		const { email, password } = req.body;
		const user = await User.findOne({ "email": email });
		if (user == undefined) return res.status(403).json({ errors: { email: "Email does not exist" } });
		let isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) return res.status(403).json({ errors: { password: "Wrong password" } });
		jwt.sign({ email: email, name: user.name, id: user._id }, JWTSecret, { expiresIn: "6h" }, (error, token) => {
			if (error) {
				res.sendStatus(500);
			} else {
				return res.json({ token: `Bearer ${token}` });
			}
		});
	}
}
module.exports = new UserController();