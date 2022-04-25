"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachCurrentUser_1 = __importDefault(require("./attachCurrentUser"));
const isAuth_1 = __importDefault(require("./isAuth"));
const isCandidate_1 = __importDefault(require("./isCandidate"));
const isCompany_1 = __importDefault(require("./isCompany"));
exports.default = {
    attachCurrentUser: attachCurrentUser_1.default,
    isAuth: isAuth_1.default,
    isCandidate: isCandidate_1.default,
    isCompany: isCompany_1.default,
};
//# sourceMappingURL=index.js.map