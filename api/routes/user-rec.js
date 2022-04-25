"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const typedi_1 = require("typedi");
const candidate_1 = __importDefault(require("./../../services/candidate"));
const company_1 = __importDefault(require("./../../services/company"));
const route = express_1.Router();
exports.default = (app) => {
    /*
     * Under the User Route we have user action of both candidate and recruiter apart from the job fetching options
     */
    app.use('/user-rec', route);
    /*
     * Method to attach role to a user
     */
    //   route.post('/auth', middlewares.attachRole);
    /*
     * Method to get full profile of a given user
     */
    route.post('/user', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.default.isCompany, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Updating the user info ', req.body);
            const companyServiceInstance = typedi_1.Container.get(company_1.default);
            const { companyRecord } = await companyServiceInstance.SetCompany(req);
            if (companyRecord['_id'] == null) {
                return res.json({ success: false, message: 'User already added to a given group' }).status(401); // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added
            }
            else {
                return res.json({ success: true }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
            }
        }
        catch (e) {
            logger.debug('Failed to add the user data');
            return res.json({ success: false, message: 'Internal server error' }).status(500);
        }
    });
    /*
     * Method to get full profile of a given user
     */
    route.post('/apply', middlewares_1.default.isAuth, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Updating the user info ', req.body);
            let jobid;
            if (req.body.jobid != null) {
                jobid = req.body.jobid;
            }
            logger.debug('Applying for job based on job slug.');
            let userDetails = {
                ['cognito:groups']: null,
            };
            userDetails = await jwt_decode_1.default(req.header('authorization'));
            logger.debug('The user id token is ', userDetails);
            if (req.currentUser['role'] == 'userCandidate') {
                logger.debug('Applying for a job post based on a given job slug.');
                const candidateServiceInstance = typedi_1.Container.get(candidate_1.default);
                const candidateAppliedJobRecord = await candidateServiceInstance.ApplyJob(userDetails, jobid);
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
    route.get('/getcans', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        if (req.currentUser['role'] === 'userRecruiter') {
            logger.debug('Fetching userdetails of recommended candidate for the given recruiter');
            const companyServiceInstance = typedi_1.Container.get(company_1.default);
            const candidateRecords = await companyServiceInstance.GetCanList(req);
            return res.json({ success: true, user: candidateRecords }).status(200);
        }
        else {
            logger.debug('Unauthorised access is seen');
            res.json({ success: false, message: 'Unauthorized' }).status(401);
        }
    });
    /*
     *   Recommendation of candidates based on skills searched by the recruiter
     */
    route.get('/search-can', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        let userDetails = {
            ['cognito:groups']: null,
        };
        userDetails = await jwt_decode_1.default(req.header('authorization'));
        if (req.currentUser['role'] == 'userRecruiter') {
            logger.debug('Fetching user details of recommended candidate');
            userDetails = await jwt_decode_1.default(req.header('authorization'));
            const companyServiceInstance = typedi_1.Container.get(company_1.default);
            const candidateRecords = await companyServiceInstance.GetCanFromSearch(userDetails, req);
            return res.json({ success: true, user: candidateRecords }).status(200);
        }
        else {
            return res.json({ success: false, message: 'unuthorised access is seen' }).status(401);
        }
    });
    /*
     *   Method to get full profile of a given candidate called by recruiter based on candidate id
     */
    route.get('/getcan', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        let canid;
        if (req.query.canid != null) {
            canid = req.query.canid;
        }
        if (req.currentUser['role'] == 'userRecruiter') {
            logger.debug('fetching the userdetails for the company to view candidates based on candidate id');
            const candidateServiceInstance = typedi_1.Container.get(candidate_1.default);
            // Here we set up the candidate deatils dusing the onboarding process
            const candidateRecord = await candidateServiceInstance.GetCandidateInfo(canid);
            // Here we the git serivce to update the candidate's git profile
            const canGitRecord = await candidateServiceInstance.GetGitInfo(canid);
            const candidateInfo = {
                about: candidateRecord.about,
                gitInfo: canGitRecord,
            };
            logger.debug('The fetched candidate record is ', candidateInfo);
            return res.json({ success: true, user: candidateInfo }).status(200);
        }
        else {
            return res.json({ success: false, message: 'unuthorised access is seen' }).status(401);
        }
    });
    /*
     *   Method to get full profile of a given user
     */
    route.get('/user', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        if (req.currentUser['role'] === 'userRecruiter') {
            //middlewares.submitCompany(req, res, next, userDetails)
            const companyServiceInstance = typedi_1.Container.get(company_1.default);
            // here we get the company record the about record from the below service method
            const { companyRecord, aboutRecord } = await companyServiceInstance.GetCompany(req);
            const companyInfo = {
                name: companyRecord.name,
                whatsappNumber: companyRecord.whatsappNumber,
                preferredIndustry: companyRecord.preferredIndustry,
                location: companyRecord.location,
                skills: companyRecord.skills,
                about: aboutRecord.about,
                empSize: companyRecord.empSize,
                site: companyRecord.site,
            };
            return res.json({ success: true, user: companyInfo }).status(200);
        }
    });
    /*
     * Method to get list of applied candidate for a given job in recruiter
     */
    route.get('/applied', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Fetching the candidates applied based on job id');
            let jobid;
            // console.log(req.query);
            if (req.query.jobid != null) {
                jobid = req.query.jobid;
            }
            logger.debug('The job slug id was ', jobid);
            if (req.currentUser['role'] === 'userCandidate') {
                logger.debug('User role set successfully in Mongo Db');
                res.json({ success: false, message: 'Unauthorized' }).status(401); // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added
            }
            if (req.currentUser['role'] === 'userRecruiter') {
                //middlewares.submitCandidate(req, res, next, userDetails)
                logger.debug('initializing the company service instance');
                const candidateServiceInstance = typedi_1.Container.get(company_1.default);
                logger.debug('Fetching the applied can');
                const candidateRecord = await candidateServiceInstance.AppliedApplicant(jobid, req);
                logger.debug('The recruiter for which the candidate info is fetched is ', candidateRecord);
                if (candidateRecord == null) {
                    res.json({ success: false, message: 'Unauthorized' }).status(401); // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added
                }
                else {
                    logger.debug('User role set successfully in Mongo Db');
                    return res.json({ success: true, enrolledCandidate: candidateRecord }).status(200);
                }
            }
        }
        catch (e) {
            logger.debug('Failed to set the user data ', e);
            return res.json({ success: false, message: 'Internal server error' }).status(500);
        }
    });
};
//# sourceMappingURL=user-rec.js.map