"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Connect = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    candidateid: {
        type: String,
    },
    companyid: {
        type: String,
    },
    status: {
        type: Number,
    },
    jobslug: {
        type: String,
    }
});
exports.default = mongoose_1.default.model('Connect', Connect);
//# sourceMappingURL=connect.js.map