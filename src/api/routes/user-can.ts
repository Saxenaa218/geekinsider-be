import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode';
import { Container } from 'typedi';
import CandidateService from './../../services/candidate';
import CompanyService from './../../services/company';
import { Logger } from 'winston';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
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
  route.post(
    '/user',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        whatsappNumber: Joi.string().required(),
        jobTitle: Joi.string().required(),
        location: Joi.string().required(),
        skills: Joi.string().required(),
        ctc: Joi.string().required(),
        exp: Joi.string().required(),
        about: Joi.string().required(),
        githubUrl: Joi.string().optional(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.isCandidate,
    async (req, res) => {
      const logger: Logger = Container.get('logger');

      try {
        logger.debug('Updating the user info ', req.body);

        // logger.debug('Id token for the following request : ', userDetails);

        const candidateServiceInstance = Container.get(CandidateService);

        const { candidateRecord } = await candidateServiceInstance.SetCandidate(req);

        logger.debug('The uploaded information is ', candidateRecord);

        if (candidateRecord['_id'] == null && req?.body?.githubUrl.length > 0) {
          // Adding the github data for the given user.
          const canGitServiceInstance = Container.get(CandidateService);

          const canGitRecord = await canGitServiceInstance.SetGithub(req);

          logger.debug("The uploaded candidate's git information is ", canGitRecord);

          return res.json({ success: true }).status(200);
        }
        return res.json({ success: true }).status(200);
      } catch (e) {
        logger.debug('Failed to add the user data');

        return res.json({ success: false, message: 'Internal server error' }).status(500);
      }
    },
  );

  /*
   * Method to get full profile of a given user
   */
  route.post('/apply', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res) => {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Updating the user info ', req.body);

      let jobid;

      if (req.body.jobid != null) {
        jobid = req.body.jobid;
      }

      logger.debug('Applying for job based on job slug.');

      if (req.currentUser['role'] == 'userCandidate') {
        logger.debug('Applying for a job post based on a given job slug.');

        const candidateServiceInstance = Container.get(CandidateService);

        const candidateAppliedJobRecord = await candidateServiceInstance.ApplyJob(req, jobid);

        logger.debug('The candidate Record added to the db is ', candidateAppliedJobRecord);

        // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added

        if (candidateAppliedJobRecord['_id'] == null) {
          return res.sendStatus(401);
        } else {
          logger.debug('Job applied successfully and the mongo record is ', candidateAppliedJobRecord['_id']);

          return res.json({ success: true }).status(200);
        }
      }
    } catch (e) {
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

  route.get('/user', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const logger: Logger = Container.get('logger');

    logger.debug('Fetching the candidate information.');

    if (req.currentUser['role'] == 'userCandidate') {
      //middlewares.submitCandidate(req, res, next, userDetails)

      logger.debug('Fetching userdetails of the candiadte');

      const candidateServiceInstance = Container.get(CandidateService);

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
        gitskills: canGitRecord?.skills,
        skillsOrder: canGitRecord?.skillsOrder,
        repoCount: canGitRecord?.repoCount,
      };

      return res.json({ success: true, user: candidateInfo }).status(200);
    }
  });
};
