"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const typedi_1 = require("typedi");
const candidate_1 = __importDefault(require("./../../services/candidate"));
const celebrate_1 = require("celebrate");
const route = express_1.Router();
exports.default = (app) => {
    /*
     * Under the User Route we have user action of both candidate and recruiter apart from the job fetching options
     */
    app.use('/user-can', route);
    /*
     * Method to attach role to a user
     */
    //   route.post('/auth', middlewares.attachRole);
    /*
     * Method to get full profile of a given user
     */
    route.post('/user', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            whatsappNumber: celebrate_1.Joi.string().required(),
            jobTitle: celebrate_1.Joi.string().required(),
            location: celebrate_1.Joi.string().required(),
            skills: celebrate_1.Joi.string().required(),
            ctc: celebrate_1.Joi.string().required(),
            exp: celebrate_1.Joi.string().required(),
            about: celebrate_1.Joi.string().required(),
            githubUrl: celebrate_1.Joi.string().optional(),
        }),
    }), middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.default.isCandidate, async (req, res) => {
        var _a;
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Updating the user info ', req.body);
            // logger.debug('Id token for the following request : ', userDetails);
            const candidateServiceInstance = typedi_1.Container.get(candidate_1.default);
            const { candidateRecord } = await candidateServiceInstance.SetCandidate(req);
            logger.debug('The uploaded information is ', candidateRecord);
            if (candidateRecord['_id'] == null && ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.githubUrl.length) > 0) {
                // Adding the github data for the given user.
                const canGitServiceInstance = typedi_1.Container.get(candidate_1.default);
                const canGitRecord = await canGitServiceInstance.SetGithub(req);
                logger.debug("The uploaded candidate's git information is ", canGitRecord);
                return res.json({ success: true }).status(200);
            }
            return res.json({ success: true }).status(200);
        }
        catch (e) {
            logger.debug('Failed to add the user data');
            return res.json({ success: false, message: 'Internal server error' }).status(500);
        }
    });
    /*
     * Method to get full profile of a given user
     */
    route.post('/apply', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Updating the user info ', req.body);
            let jobid;
            if (req.body.jobid != null) {
                jobid = req.body.jobid;
            }
            logger.debug('Applying for job based on job slug.');
            if (req.currentUser['role'] == 'userCandidate') {
                logger.debug('Applying for a job post based on a given job slug.');
                const candidateServiceInstance = typedi_1.Container.get(candidate_1.default);
                const candidateAppliedJobRecord = await candidateServiceInstance.ApplyJob(req, jobid);
                logger.debug('The candidate Record added to the db is ', candidateAppliedJobRecord);
                // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added
                if (candidateAppliedJobRecord['_id'] == null) {
                    return res.sendStatus(401);
                }
                else {
                    logger.debug('Job applied successfully and the mongo record is ', candidateAppliedJobRecord['_id']);
                    return res.json({ success: true }).status(200);
                }
            }
        }
        catch (e) {
            logger.debug('Failed to add the user data');
            return res.json({ success: false, message: 'Internal server error' }).status(500);
        }
    });
    /*
     *   Recommendation of candidates based on skills defined by recruiter during the onboarding process of the recruiter
     */
    /*
     *   Recommendation of candidates based on skills searched by the recruiter
     */
    /*
     *   Method to get full profile of a given candidate called by recruiter based on candidate id
     */
    /*
     *   Method to get full profile of a given user
     */
    route.get('/user', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Fetching the candidate information.');
        if (req.currentUser['role'] == 'userCandidate') {
            //middlewares.submitCandidate(req, res, next, userDetails)
            logger.debug('Fetching userdetails of the candiadte');
            const candidateServiceInstance = typedi_1.Container.get(candidate_1.default);
            // here we get the candidate record the about record from the below service method
            const { candidateRecord, aboutRecord } = await candidateServiceInstance.GetCandidate(req);
            // here we get the git info for a given candidate
            const canGitRecord = await candidateServiceInstance.GetGitInfo(req.currentUser._id);
            const candidateInfo = {
                name: candidateRecord.name,
                jobTitle: candidateRecord.jobTitle,
                githubUrl: candidateRecord.githubUrl,
                skills: candidateRecord.skills,
                about: aboutRecord.about,
                whatsappNumber: candidateRecord.whatsappNumber,
                exp: candidateRecord.exp,
                ctc: candidateRecord.ctc,
                location: candidateRecord.location,
                gitskills: canGitRecord === null || canGitRecord === void 0 ? void 0 : canGitRecord.skills,
                skillsOrder: canGitRecord === null || canGitRecord === void 0 ? void 0 : canGitRecord.skillsOrder,
                repoCount: canGitRecord === null || canGitRecord === void 0 ? void 0 : canGitRecord.repoCount,
            };
            return res.json({ success: true, user: candidateInfo }).status(200);
        }
    });
};
//# sourceMappingURL=user-can.js.map