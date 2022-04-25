"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Candidate = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        // Here we enter the name for a given candidate
        type: String,
        required: true,
    },
    whatsappNumber: {
        // Here we enter the whatsapp number for a given candidate
        type: String,
    },
    jobTitle: {
        // Here we enter the jobtitle for the current candidate
        type: String,
    },
    location: {
        // Here we enter the cuurrent location of the candidate
        type: String,
    },
    githubUrl: {
        // the github url corresponds to the git url for the given candidate
        type: String,
    },
    ctc: {
        // Here we enter the current ctc for a given candidate
        type: String,
    },
    exp: {
        // Here we enter the current exp for a given candidate
        type: String,
    },
    skills: [],
    aboutid: {
        // Here we enter the about id for a given candidate which will link to the about of a given candidate
        type: String,
    },
});
exports.default = mongoose_1.default.model('Candidate', Candidate);
//# sourceMappingURL=candidate.js.map