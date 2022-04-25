import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode';
import { Container } from 'typedi';
import JobService from './../../services/job';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  /*
   * Under the Job Route we have both condidate and recruiter profile routes for job related action
   */
  app.use('/jobs', route);

  /*
   * Method to post a job for a given recruiter
   */
  route.post('/job', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Posting a job');

      logger.debug('Checking the cognito user role wether recruiter or not');

      if (req.currentUser['role'] !== 'userRecruiter') {
        return res.json({ success: false, message: "User doesn't belong to a given group" }).status(401);
      }

      const jobServiceInstance = Container.get(JobService);

      logger.debug('Calling the job service to create a job application');

      const jobRecord = await jobServiceInstance.CreateJob(req);

      logger.debug('The added job record is ', jobRecord);

      return res.json({ success: true, jobDetail: jobRecord }).status(200);
    } catch (e) {
      logger.debug('Failed to create job');

      return res.json({ success: false, message: 'Unable to create a job please try again' }).status(500);
    }
  });

  /*
   * Get Job Description based on query string parameteres.
   */
  route.get('/jobdetaildesc', async (req: Request, res: Response) => {
    let cname;
    let title;

    let aboutRecord;

    // Get job description based on Company Name and Job title

    if (req.query.cname != null && req.query.title != null) {
      cname = req.query.cname;
      title = req.query.title;

      const jobServiceInstance = Container.get(JobService);
      aboutRecord = await jobServiceInstance.GetJobDescription(cname, title);
    }

    if (aboutRecord == null) {
      return res.json({ success: true, jobDescription: {}, result: false }).status(200);
    } else {
      const JobDesc = {
        JobDescription: aboutRecord.about,
      };
      return res.json({ success: true, jobDescription: JobDesc, result: true }).status(200);
    }
  });

  /*
   * Method to get job details based on jobdetail slug.
   */
  route.get('/jobdetail', async (req: Request, res: Response) => {
    const logger: Logger = Container.get('logger');

    if (req.query.jobid == null) {
      return res.json({ success: false, message: 'unuthorised access is seen' }).status(401);
    }
    const jobslug = req.query.jobid;

    logger.debug('Fetching the job id : ', jobslug);

    const jobServiceInstance = Container.get(JobService);

    const jobRecord = await jobServiceInstance.GetJobDescriptionBySlug(jobslug);

    // to see the userRecord in the debug logs
    logger.debug('The job record i.e fetched is ', jobRecord);

    if (jobRecord == null) {
      return res.json({ success: true, jobRecord: [], message: 'Job record not found' }).status(200);
    } else {
      return res.json({ success: true, jobRecord: jobRecord }).status(200);
    }
  });

  /*
   * Method to get jobs by trend. GetJobByTrend.
   */
  route.get('/trend', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const jobServiceInstance = Container.get(JobService);

    const jobRecords = await jobServiceInstance.GetJobByTrend(req);

    if (jobRecords == null) {
      // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
      return res.json({ success: true, jobRecord: [] }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
    } else {
      return res.json({ success: true, jobRecord: jobRecords }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
    }
  });

  /*
   * Method to get recomended jobs for a user. GetJobByRecommendation.
   */
  route.get('/reco', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const jobServiceInstance = Container.get(JobService);

    const jobRecords = await jobServiceInstance.GetJobByReco(req);

    if (jobRecords == null) {
      // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
      return res.json({ success: true, jobRecord: [] }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
    } else {
      return res.json({ success: true, jobRecord: jobRecords }).status(200); //console.log("User role set successfully in Mongo Db");           // successful response
    }
  });

  /*
   * Method to get jobs by multiple query string parameters.
   */
  route.get('/job', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const logger: Logger = Container.get('logger');

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
      const jobServiceInstance = Container.get(JobService);

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

      const jobServiceInstance = Container.get(JobService);

      jobRecords = await jobServiceInstance.GetJobsListBasedOnCompanyName(cname);

      return res.json({ success: true, jobRecord: jobRecords }).status(200);
    }

    // route for job based on their id's
    if (cname == null && skills == null && jobslug == null && req.currentUser['role'] == 'userRecruiter') {
      const jobServiceInstance = Container.get(JobService);

      logger.debug('Fetching jobs for recruiter');

      jobRecords = await jobServiceInstance.GetJobsListRec(req);

      return res.json({ success: true, jobRecord: jobRecords }).status(200);
    }

    // route for job based on their id's
    if (req.currentUser['role'] == 'userCandidate') {
      const jobServiceInstance = Container.get(JobService);

      jobRecords = await jobServiceInstance.GetJobsListCan(req);

      return res.json({ success: true, jobRecord: jobRecords }).status(200);
    }

    if (jobRecords == null) {
      return res.json({ success: true, jobRecord: [] }).status(200);
    } else {
      return res.json({ success: true, jobRecord: jobRecords }).status(200);
    }
  });
};
