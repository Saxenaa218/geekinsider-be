"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const typedi_1 = require("typedi");
const job_1 = __importDefault(require("./../../services/job"));
const route = express_1.Router();
exports.default = (app) => {
    /*
     * Under the Job Route we have both condidate and recruiter profile routes for job related action
     */
    app.use('/jobs', route);
    /*
     * Method to post a job for a given recruiter
     */
    route.post('/job', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        try {
            logger.debug('Posting a job');
            logger.debug('Checking the cognito user role wether recruiter or not');
            if (req.currentUser['role'] !== 'userRecruiter') {
                return res.json({ success: false, message: "User doesn't belong to a given group" }).status(401);
            }
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            logger.debug('Calling the job service to create a job application');
            const jobRecord = await jobServiceInstance.CreateJob(req);
            logger.debug('The added job record is ', jobRecord);
            return res.json({ success: true, jobDetail: jobRecord }).status(200);
        }
        catch (e) {
            logger.debug('Failed to create job');
            return res.json({ success: false, message: 'Unable to create a job please try again' }).status(500);
        }
    });
    /*
     * Get Job Description based on query string parameteres.
     */
    route.get('/jobdetaildesc', async (req, res) => {
        let cname;
        let title;
        let aboutRecord;
        // Get job description based on Company Name and Job title
        if (req.query.cname != null && req.query.title != null) {
            cname = req.query.cname;
            title = req.query.title;
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            aboutRecord = await jobServiceInstance.GetJobDescription(cname, title);
        }
        if (aboutRecord == null) {
            return res.json({ success: true, jobDescription: {}, result: false }).status(200);
        }
        else {
            const JobDesc = {
                JobDescription: aboutRecord.about,
            };
            return res.json({ success: true, jobDescription: JobDesc, result: true }).status(200);
        }
    });
    /*
     * Method to get job details based on jobdetail slug.
     */
    route.get('/jobdetail', async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        if (req.query.jobid == null) {
            return res.json({ success: false, message: 'unuthorised access is seen' }).status(401);
        }
        const jobslug = req.query.jobid;
        logger.debug('Fetching the job id : ', jobslug);
        const jobServiceInstance = typedi_1.Container.get(job_1.default);
        const jobRecord = await jobServiceInstance.GetJobDescriptionBySlug(jobslug);
        // to see the userRecord in the debug logs
        logger.debug('The job record i.e fetched is ', jobRecord);
        if (jobRecord == null) {
            return res.json({ success: true, jobRecord: [], message: 'Job record not found' }).status(200);
        }
        else {
            return res.json({ success: true, jobRecord: jobRecord }).status(200);
        }
    });
    /*
     * Method to get jobs by trend. GetJobByTrend.
     */
    route.get('/trend', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const jobServiceInstance = typedi_1.Container.get(job_1.default);
        const jobRecords = await jobServiceInstance.GetJobByTrend(req);
        if (jobRecords == null) {
            // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
            return res.json({ success: true, jobRecord: [] }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
        }
        else {
            return res.json({ success: true, jobRecord: jobRecords }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
        }
    });
    /*
     * Method to get recomended jobs for a user. GetJobByRecommendation.
     */
    route.get('/reco', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const jobServiceInstance = typedi_1.Container.get(job_1.default);
        const jobRecords = await jobServiceInstance.GetJobByReco(req);
        if (jobRecords == null) {
            // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
            return res.json({ success: true, jobRecord: [] }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
        }
        else {
            return res.json({ success: true, jobRecord: jobRecords }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
        }
    });
    /*
     * Method to get jobs by multiple query string parameters.
     */
    route.get('/job', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, async (req, res) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Fetching the jobs based on Company Name');
        let cname;
        let skills;
        let latest;
        let jobslug;
        if (req.query.cname != null) {
            cname = req.query.cname;
            logger.debug(cname);
        }
        if (req.query.skills != null) {
            const tmpSkills = req.query.skills.toString();
            skills = tmpSkills.split(',');
        }
        if (req.query.jobslug != null) {
            jobslug = req.query.jobslug;
            logger.debug(jobslug);
        }
        if (req.query.latest != null) {
            latest = req.query.latest;
            logger.debug(latest);
        }
        let jobRecords;
        // route for filter based on skills
        if (skills != null) {
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnSkill(skills);
            return res.json({ success: true, jobRecord: jobRecords }).status(200);
        }
        //GetJobDescriptionBySlug
        // if(jobslug != null)
        // {
        //     const jobServiceInstance = Container.get(JobService);
        //     jobRecords = await jobServiceInstance.GetJobDescriptionBySlug(jobslug);
        // }
        // route for filter based on company name
        if (cname != null) {
            logger.debug('searching job based on cname');
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnCompanyName(cname);
            return res.json({ success: true, jobRecord: jobRecords }).status(200);
        }
        // route for job based on their id's
        if (cname == null && skills == null && jobslug == null && req.currentUser['role'] == 'userRecruiter') {
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            logger.debug('Fetching jobs for recruiter');
            jobRecords = await jobServiceInstance.GetJobsListRec(req);
            return res.json({ success: true, jobRecord: jobRecords }).status(200);
        }
        // route for job based on their id's
        if (req.currentUser['role'] == 'userCandidate') {
            const jobServiceInstance = typedi_1.Container.get(job_1.default);
            jobRecords = await jobServiceInstance.GetJobsListCan(req);
            return res.json({ success: true, jobRecord: jobRecords }).status(200);
        }
        if (jobRecords == null) {
            return res.json({ success: true, jobRecord: [] }).status(200);
        }
        else {
            return res.json({ success: true, jobRecord: jobRecords }).status(200);
        }
    });
};
//# sourceMappingURL=job.js.map