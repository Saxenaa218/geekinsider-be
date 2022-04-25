"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const user_can_1 = __importDefault(require("./routes/user-can"));
const user_rec_1 = __importDefault(require("./routes/user-rec"));
const agendash_1 = __importDefault(require("./routes/agendash"));
const utils_1 = __importDefault(require("./routes/utils"));
const job_1 = __importDefault(require("./routes/job"));
// guaranteed to get dependencies
exports.default = () => {
    const app = express_1.Router();
    auth_1.default(app);
    user_can_1.default(app);
    user_rec_1.default(app);
    job_1.default(app);
    utils_1.default(app);
    agendash_1.default(app);
    return app;
};
//# sourceMappingURL=index.js.map