"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const skills_1 = __importDefault(require("../../utils/skills"));
const cities_1 = __importDefault(require("../../utils/cities"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/utils', route);
    /*
     * Method to get a list of predefined skills
     */
    route.get('/skills', middlewares_1.default.isAuth, (req, res) => {
        return res.json({ skills: skills_1.default }).status(200);
    });
    /*
     * Method to get a list of predefined cities
     */
    route.get('/cities', middlewares_1.default.isAuth, (req, res) => {
        return res.json({ cities: cities_1.default }).status(200);
    });
};
//# sourceMappingURL=utils.js.map