import { Service, Inject } from 'typedi';
import { ICandidate } from './../interfaces/ICandidate';
import { IAbout } from './../interfaces/IAbout';

const axios = require('axios');
import { Logger } from 'winston';
import { Container } from 'typedi';

@Service()
export default class CandidateService {
  constructor(
    @Inject('candidateModel') private candidateModel: Models.CandidateModel,
    @Inject('aboutModel') private aboutModel: Models.AboutModel,
    @Inject('connectModel') private connectModel: Models.ConnectModel,
    @Inject('jobModel') private jobModel: Models.JobModel,
    @Inject('gitModel') private gitModel: Models.GitModel,
  ) {}

  public async GetCandidateInfo(canid): Promise<any> {
    const logger: Logger = Container.get('logger');
    try {
      const aboutRecord = await this.aboutModel.findOne({
        _id: canid,
      });
      logger.debug(aboutRecord);
      return aboutRecord;
    } catch (e) {
      throw e;
    }
  }

  public async GetGitInfo(canid): Promise<any> {
    const logger: Logger = Container.get('logger');
    try {
      const gitRecord = await this.gitModel.findOne({
        _id: canid,
      });
      logger.debug(gitRecord);
      return gitRecord;
    } catch (e) {
      throw e;
    }
  }

  public async SetCandidate(req): Promise<{ candidateRecord: ICandidate }> {
    const logger: Logger = Container.get('logger');
    try {
      logger.debug('Submitting the About Section For the Candidate');

      const aboutRecord = await this.aboutModel.create({
        _id: req.currentUser._id,
        about: req.body.about,
      });

      logger.debug('Submitting the Candidate Details');
      const skills = req.body.skills.split(',');

      const candidateRecord = await this.candidateModel.create({
        _id: req.currentUser._id, // cognitoUsername will be used as the id parameter for the user table.
        name: req.body.name,
        whatsappNumber: req.body.whatsappNumber,
        jobTitle: req.body.jobTitle,
        location: req.body.location,
        skills: skills,
        githubUrl: req.body.githubUrl,
        ctc: req.body.ctc,
        exp: req.body.exp,
        aboutid: aboutRecord['_id'],
        email: req.currentUser.email,
      });

      logger.debug(candidateRecord);

      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return { candidateRecord };
    } catch (e) {
      logger.debug(e);
      throw e;
    }
  }

  public async SetGithub(req): Promise<any> {
    const logger: Logger = Container.get('logger');
    try {
      const getRepoCount = await axios.get('https://api.github.com/users/' + req.body.githubUrl); // https://api.github.com/users/vishaljkk/repos
      logger.debug(getRepoCount.data.public_repos);

      const response = await axios.get('https://api.github.com/users/' + req.body.githubUrl + '/repos');

      const repoNameList = [];
      const languageList = [];
      const languageCounter = [];

      for (let i = 0; i < response.data.length; i++) {
        repoNameList.push(response.data[i].name);
        if (response.data[i].language == null) {
          continue;
        }
        const index = languageList.indexOf(response.data[i].language);
        if (index != -1) {
          languageCounter[index] = languageCounter[index] + 1;
        } else {
          languageList.push(response.data[i].language);
          languageCounter.push(1);
        }
      }

      for (let i = 0; i < languageCounter.length; i++) {
        for (let j = i; j < languageCounter.length; j++) {
          logger.debug(languageCounter[i], languageCounter[j]);
          if (languageCounter[i] < languageCounter[j]) {
            logger.debug(languageCounter[i], languageCounter[j]);
            const temp = languageCounter[i];
            languageCounter[i] = languageCounter[j];
            languageCounter[j] = temp;
            const templang = languageList[i];
            languageList[i] = languageList[j];
            languageList[j] = templang;
          }
        }
      }

      const languagePercent = [];

      for (let i = 0; i < languageCounter.length; i++) {
        languagePercent[i] = (languageCounter[i] / languageCounter[0]) * 100;
      }

      // here we add the git data to our mongoose model

      const gitRecord = await this.gitModel.create({
        _id: req.currentUser._id, // slug+1 // cognitoUsername will be used as the id parameter for the user table.
        repoCount: getRepoCount.data.public_repos,
        repoName: repoNameList,
        skills: languageList,
        skillsOrder: languagePercent,
      });
      logger.debug(gitRecord); // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetRecoCanList(token): Promise<any> {
    try {
      const candidateRecords = await this.candidateModel.find(token.sub);

      return candidateRecords; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetCandidate(token): Promise<{ candidateRecord: ICandidate; aboutRecord: IAbout }> {
    const logger: Logger = Container.get('logger');
    try {
      logger.debug('Fetching the Candidate Details');

      const candidateRecord = await this.candidateModel.findById(token.currentUser._id);
      const aboutRecord = await this.aboutModel.findById(token.currentUser._id);

      logger.debug('the fetched candidate record is ', candidateRecord);
      logger.debug('the fetched candidate record is ', aboutRecord);

      return { candidateRecord, aboutRecord }; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetCandidateBasedOnJob(token): Promise<{ candidateRecord: ICandidate; aboutRecord: IAbout }> {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Fetching the Candidate Details');

      const candidateRecord = await this.candidateModel.findById(token.sub);

      const aboutRecord = await this.aboutModel.findById(token.sub);

      logger.debug('The candidate record fetched is :', candidateRecord);

      return { candidateRecord, aboutRecord }; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async ApplyJob(token, jobid): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Applying the Candidate Details with job slug : ', jobid);

      const jobRecord = await this.jobModel.findOne({
        jobslug: jobid,
      });

      logger.debug(jobRecord);

      const chatid = token.currentUser._id + '-' + jobid;

      logger.debug(jobRecord['companyId'], token.currentUser._id);

      logger.debug(token.currentUser._id, ' ', jobRecord['companyId']);

      const chatRecord = await this.connectModel.create({
        _id: chatid, // slug+1 // cognitoUsername will be used as the id parameter for the user table.
        candidateid: token.currentUser._id,
        companyid: jobRecord['companyId'],
        jobslug: jobid,
        status: 1,
      });

      logger.debug(chatRecord);

      return chatRecord; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }
}
