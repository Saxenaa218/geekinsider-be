import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { Container } from 'typedi';

@Service()
export default class JobService {
  constructor(
    @Inject('candidateModel') private candidateModel: Models.CandidateModel,
    @Inject('companyModel') private companyModel: Models.CompanyModel,
    @Inject('jobModel') private jobModel: Models.JobModel,
    @Inject('aboutModel') private aboutModel: Models.AboutModel,
  ) {}

  public async CreateJob(req): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Submitting the About Section For the Candidate');

      // fetched the company model for the given company
      const companyRecord = await this.companyModel.findById(req.currentUser._id);

      let count = companyRecord['jobCount'];

      logger.debug(count);

      count = count + 1;

      logger.debug(companyRecord);

      // then inserted the data inside the about for setting up the job desccription
      const aboutRecord = await this.aboutModel.create({
        _id: req.currentUser._id + '-' + count,
        about: req.body.jobDescription,
      });

      logger.debug(aboutRecord);

      // request.currentUser._id+"-"+companyRecord.jobcount+1
      // setting up the ojb model

      const skills = req.body.skills.split(',');

      const jobRecord = await this.jobModel.create({
        _id: req.currentUser._id + '-' + count, // cognitoUsername will be used as the id parameter for the user table.
        companyName: companyRecord.name,
        jobTitle: req.body.jobTitle,
        jobLocation: req.body.jobLocation,
        aboutid: req.currentUser._id + '-' + count,
        companyId: companyRecord._id,
        skills: skills,
        jobslug: companyRecord.name + '-' + req.body.jobTitle + count,
        ctc: req.body.ctc,
        exp: req.body.exp,
      });

      //count = count+1;

      // The job model indesrted in the Db is
      logger.debug(jobRecord);

      const updatedCompanyRecord = await this.companyModel.findOneAndUpdate(
        {
          _id: req.currentUser._id,
        },
        { jobCount: count },
        { upsert: true, useFindAndModify: false },
      );

      // updating the job count in the company record

      logger.debug(updatedCompanyRecord);

      const jobUploaded = {
        companyName: companyRecord.name,
        companyId: companyRecord._id,
        jobTitle: req.body.jobTitle,
        jobLocation: req.body.jobLocation,
        jobStatus: true,
        jobDescription: req.body.jobDescription,
        skills: jobRecord.skills,
        jobslug: jobRecord.jobslug,
        ctc: req.body.ctc,
        exp: req.body.exp,
      };

      // returning the job object
      return { jobUploaded };
    } catch (e) {
      logger.debug(e);
      throw e;
    }
  }

  public async GetJobsListBasedOnCompanyName(cname): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      // const jobRecord = await this.jobModel.find(request.currentUser._id);
      const query = { companyName: cname };
      logger.debug(query);

      const jobRecord = await this.jobModel.find(query);
      logger.debug(jobRecord);

      const jobList = [];
      let i = 0;
      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }

      return jobList; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetJobByReco(request): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      const candidateRecord = await this.candidateModel.findById(request.currentUser._id);
      const skills = candidateRecord.skills;

      // below both the methods are valid for quering a search in mongo using moongoose for multiple search in inside an aaray of object
      const jobRecord = await this.jobModel.find({ skills: { $in: skills } });

      //const jobRecord = this.jobModel.find(skillQueryString);
      const jobList = [];
      let i = 0;

      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      //logger.debug(jobList);
      //return jobList
      return jobRecord; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetJobByTrend(request): Promise<any> {
    try {
      const candidateRecord = await this.candidateModel.findById(request.currentUser._id);

      const skills = candidateRecord.skills;

      const jobRecord = await this.jobModel.find({ skills: { $in: skills } });

      const jobList = [];
      let i = 0;

      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      return jobRecord; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetJobsListRec(request): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      // const jobRecord = await this.jobModel.find(request.currentUser._id);                                                        // logger.debug("Fetching the Candidate Details");                                                                                                           //let ObjectId = mongoose.Types.ObjectId;
      const query = { companyId: request.currentUser._id };
      logger.debug(query);
      const jobRecord = await this.jobModel.find(query);
      logger.debug(jobRecord);
      const jobList = [];
      let i = 0;
      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      return jobList; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetUserBySkill(request): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      // const jobRecord = await this.jobModel.find(request.currentUser._id);                                                        // logger.debug("Fetching the Candidate Details");                                                                                                           //let ObjectId = mongoose.Types.ObjectId;
      const query = { companyId: request.currentUser._id };
      logger.debug(query);
      const jobRecord = await this.jobModel.find(query);
      logger.debug(jobRecord);
      const jobList = [];
      let i = 0;
      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      return jobList; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetJobsListCan(request): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      logger.debug('Fetching job list for recruiter');
      // const jobRecord = await this.jobModel.find(request.currentUser._id);                                                        // logger.debug("Fetching the Candidate Details");                                                                                                           //let ObjectId = mongoose.Types.ObjectId;
      const query = { companyId: request.currentUser._id };
      // logger.debug(query);
      const jobRecord = await this.jobModel.find(query);
      const jobList = [];
      let i = 0;
      for (; i < jobRecord.length; i++) {
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      return jobList; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }

  public async GetJobDescription(companyName, jobTitle): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      const jobRecord = await this.jobModel.findOne({ companyName: companyName, jobTitle: jobTitle });
      if (jobRecord == null) {
        return;
      }
      const aboutRecord = await this.aboutModel.findOne({ _id: jobRecord._id });
      return aboutRecord;
    } catch (e) {
      logger.debug(e);
    }
  }

  public async GetJobDescriptionBySlug(jobslug): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      const query = { jobslug: jobslug };
      const jobRecord = await this.jobModel.findOne(query);
      logger.debug(jobRecord);
      const aboutRecord = await this.aboutModel.findOne({ _id: jobRecord._id });
      const jobDetail = {
        companyName: jobRecord.companyName,
        jobTitle: jobRecord.jobTitle,
        jobLocation: jobRecord.jobLocation,
        skills: jobRecord.skills,
        ctc: jobRecord.ctc,
        exp: jobRecord.exp,
        jobDescription: aboutRecord.about,
        jobslug: jobRecord.jobslug,
      };

      return jobDetail;
    } catch (e) {
      logger.debug(e);
    }
  }

  public async GetJobsListBasedOnSkill(skills): Promise<any> {
    const logger: Logger = Container.get('logger');

    try {
      // below both the methods are valid for quering a search in mongo using moongoose for multiple search in inside an aaray of object
      const jobRecord = await this.jobModel.find({ skills: { $in: skills } });
      //const jobRecord = this.jobModel.find(skillQueryString);

      //logger.debug(jobRecord);
      const jobList = [];
      let i = 0;

      //logger.debug(jobRecord);
      for (; i < jobRecord.length; i++) {
        // logger.debug(jobRecord)
        const job = {
          companyName: jobRecord[i].companyName,
          jobTitle: jobRecord[i].jobTitle,
          jobLocation: jobRecord[i].jobLocation,
          jobStatus: jobRecord[i].jobStatus,
          skills: jobRecord[i].skills,
          jobslug: jobRecord[i].jobslug,
          ctc: jobRecord[i].ctc,
          exp: jobRecord[i].exp,
        };
        jobList.push(job);
      }
      return jobRecord; // Need to update the data in the user model also need to remove console logs once upadted the method properly
    } catch (e) {
      throw e;
    }
  }
}
