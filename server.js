import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";

// import beerData from "./beerData.js";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const userModel = mongoose.model("User", userSchema);

const beerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    tagline: String,
    first_brewed: String,
    description: String,
    image_url: String,
    abv: Number,
    ibu: Number,
    target_fg: Number,
    target_og: Number,
    ebc: Number,
    srm: Number,
    ph: Number,
    attenuation_level: Number,
    volume: Object,
    boil_volume: Object,
});
const beerModel = mongoose.model("Beer", beerSchema);

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    // await userModel.deleteMany({})
    // userModel.insertMany([{ username: "abc", password: "123" }, { username: "xyz", password: "321" }])
} catch (error) {
    console.error(error);
}

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const secretKey = "secret";
passport.use("login", new LocalStrategy((username, password, done) => {
    userModel.findOne({ username, password })
        .then(user => done(null, user))
        .catch(error => done(error, false));
}));
passport.use("auth", new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretKey,
    },
    (jwtPayload, done) => {
        userModel.findById(jwtPayload._id)
            .then(user => done(null, user))
            .catch(error => done(error));
    },
));
app.post("/user/signup", async (req, res) => {
    // console.log(req.body);
    const { username } = req.body;
    const user = await userModel.findOne({ username }).exec();
    console.log(user);
    res.send(user);
});
app.post("/user/login", passport.authenticate("login", { session: false }), (req, res) => {
    const token = jwt.sign(JSON.stringify(req.user), secretKey);
    res.send(token);
});
app.get("/user/auth", passport.authenticate("auth", { session: false }), (req, res) => {
    res.send(true);
});
app.post("/user/logout", passport.authenticate("auth", { session: false }), (req, res) => {
    req.logOut((error) => {
        error ? res.send(false) : res.send(true);
    });
});

app.get("/beer/query", async (req, res) => {
    // await beerModel.insertMany(beerData);
    // await beerModel.deleteMany({});
    const query = await beerModel.find({
        // ph: { $gte: 5 },
    }).exec();
    setTimeout(() => {
        res.send(query);
    }, 2000);
});
app.post("/beer/update", async (req, res) => {
    const { body: { id } } = req;
    const result = await beerModel.findOneAndUpdate({ id }, req.body, { returnDocument: "after" });
    setTimeout(() => {
        res.send(result);
    }, 2000);
});
app.post("/beer/delete/:id", async (req, res) => {
    const { params: { id } } = req;
    const query = await beerModel.findOne({ id }).exec();
    res.send(query);
});
app.listen(8888);
