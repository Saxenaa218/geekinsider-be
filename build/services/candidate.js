"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const axios = require('axios');
const typedi_2 = require("typedi");
let CandidateService = class CandidateService {
    constructor(candidateModel, aboutModel, connectModel, jobModel, gitModel) {
        this.candidateModel = candidateModel;
        this.aboutModel = aboutModel;
        this.connectModel = connectModel;
        this.jobModel = jobModel;
        this.gitModel = gitModel;
    }
    async GetCandidateInfo(canid) {
        const logger = typedi_2.Container.get('logger');
        try {
            const aboutRecord = await this.aboutModel.findOne({
                _id: canid,
            });
            logger.debug(aboutRecord);
            return aboutRecord;
        }
        catch (e) {
            throw e;
        }
    }
    async GetGitInfo(canid) {
        const logger = typedi_2.Container.get('logger');
        try {
            const gitRecord = await this.gitModel.findOne({
                _id: canid,
            });
            logger.debug(gitRecord);
            return gitRecord;
        }
        catch (e) {
            throw e;
        }
    }
    async SetCandidate(req) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Submitting the About Section For the Candidate');
            const aboutRecord = await this.aboutModel.create({
                _id: req.currentUser._id,
                about: req.body.about,
            });
            logger.debug('Submitting the Candidate Details');
            const skills = req.body.skills.split(',');
            const candidateRecord = await this.candidateModel.create({
                _id: req.currentUser._id,
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
        }
        catch (e) {
            logger.debug(e);
            throw e;
        }
    }
    async SetGithub(req) {
        const logger = typedi_2.Container.get('logger');
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
                }
                else {
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
                _id: req.currentUser._id,
                repoCount: getRepoCount.data.public_repos,
                repoName: repoNameList,
                skills: languageList,
                skillsOrder: languagePercent,
            });
            logger.debug(gitRecord); // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
    async GetRecoCanList(token) {
        try {
            const candidateRecords = await this.candidateModel.find(token.sub);
            return candidateRecords; // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
    async GetCandidate(token) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Fetching the Candidate Details');
            const candidateRecord = await this.candidateModel.findById(token.currentUser._id);
            const aboutRecord = await this.aboutModel.findById(token.currentUser._id);
            logger.debug('the fetched candidate record is ', candidateRecord);
            logger.debug('the fetched candidate record is ', aboutRecord);
            return { candidateRecord, aboutRecord }; // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
    async GetCandidateBasedOnJob(token) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Fetching the Candidate Details');
            const candidateRecord = await this.candidateModel.findById(token.sub);
            const aboutRecord = await this.aboutModel.findById(token.sub);
            logger.debug('The candidate record fetched is :', candidateRecord);
            return { candidateRecord, aboutRecord }; // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
    async ApplyJob(token, jobid) {
        const logger = typedi_2.Container.get('logger');
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
                _id: chatid,
                candidateid: token.currentUser._id,
                companyid: jobRecord['companyId'],
                jobslug: jobid,
                status: 1,
            });
            logger.debug(chatRecord);
            return chatRecord; // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
};
CandidateService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('candidateModel')),
    __param(1, typedi_1.Inject('aboutModel')),
    __param(2, typedi_1.Inject('connectModel')),
    __param(3, typedi_1.Inject('jobModel')),
    __param(4, typedi_1.Inject('gitModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CandidateService);
exports.default = CandidateService;
//# sourceMappingURL=candidate.js.map