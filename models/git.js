"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Git = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    repoCount: {
        // total public repo count of a givven git user
        type: Number,
        required: true,
    },
    repoName: [],
    skills: [],
    skillsOrder: [],
});
exports.default = mongoose_1.default.model('Git', Git);
//# sourceMappingURL=git.js.map