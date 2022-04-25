"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isCandidate = (req, res, next) => {
    /**
     *   middlewares.isRole we will this middle ware to see the different actions
     */
    try {
        if (req.currentUser.role == 'userCandidate') {
            return next();
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (e) {
        return next(e);
    }
};
exports.default = isCandidate;
//# sourceMappingURL=isCandidate.js.map