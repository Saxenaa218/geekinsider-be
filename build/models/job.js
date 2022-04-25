"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Job = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    exp: {
        type: Number,
    },
    ctc: {
        type: Number,
    },
    companyName: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String
    },
    jobLocation: {
        type: String
    },
    jobStatus: {
        type: Boolean,
        default: true
    },
    skills: [],
    jobAboutid: {
        type: String
    },
    jobslug: {
        type: String
    },
    canApplied: [],
});
exports.default = mongoose_1.default.model('Job', Job);
//# sourceMappingURL=job.js.map