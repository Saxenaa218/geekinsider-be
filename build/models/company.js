"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Company = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        // name = name of the company or recruiter
        type: String,
        required: true,
    },
    whatsappNumber: {
        // whatsapp number of the company
        type: String,
    },
    location: {
        // Location tells where the company is located at.
        type: String,
    },
    preferredIndustry: {
        // preferred industry is to tell which is the companys preferred domain
        type: String,
    },
    skills: [],
    aboutid: {
        // Here we enter the about id for a given candidate which will link to the about of a given candidate
        type: String,
    },
    empSize: {
        // tells us the strength of the company
        type: Number,
    },
    site: {
        // This will be used to store the site of the company
        type: String,
    },
    jobCount: {
        // Here we enter the about id for a given candidate which will tell us the number of jobs a company has opted for
        type: Number,
        default: 0,
    },
    jobs: [],
});
exports.default = mongoose_1.default.model('Company', Company);
//# sourceMappingURL=company.js.map