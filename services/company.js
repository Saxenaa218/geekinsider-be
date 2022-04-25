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
const typedi_2 = require("typedi");
let CompanyService = class CompanyService {
    constructor(companyModel, candidateModel, aboutModel, connectModel) {
        this.companyModel = companyModel;
        this.candidateModel = candidateModel;
        this.aboutModel = aboutModel;
        this.connectModel = connectModel;
    }
    async AppliedApplicant(jobid, userDetails) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('the applied applicatns are', jobid);
            const connectRecord = await this.connectModel.find({
                $and: [{ jobslug: jobid }, { companyid: userDetails.currentUser._id }],
            });
            logger.debug(connectRecord.length);
            const connections = [];
            let i = 0;
            for (; i < connectRecord.length; i++) {
                logger.debug(connectRecord.length);
                const fetchCan = { _id: connectRecord[i]['candidateid'] }; // companyRecord.name+"-"+req.body.jobTitle+count
                const candidateRecord = await this.candidateModel.find(fetchCan);
                logger.debug('The can record is : ', candidateRecord);
                connections.push({
                    skills: candidateRecord[i]['skills'],
                    name: candidateRecord[i]['name'],
                    jobTitle: candidateRecord[i]['jobTitle'],
                    location: candidateRecord[i]['location'],
                    exp: candidateRecord[i]['exp'],
                    whatsappNumber: candidateRecord[i]['whatsappNumber'],
                    userId: candidateRecord[i]['_id'],
                    githubUrl: candidateRecord[i]['githubUrl'],
                });
            }
            logger.debug(connections);
            return connections;
        }
        catch (e) {
            logger.debug(e);
            throw e;
        }
    }
    async SetCompany(req) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Submitting the Company Details');
            const skills = req.body.skills.split(',');
            const aboutRecord = await this.aboutModel.create({
                _id: req.currentUser._id,
                about: req.body.about,
            });
            const companyRecord = await this.companyModel.create({
                _id: req.currentUser._id,
                name: req.body.name,
                whatsappNumber: req.body.whatsappNumber,
                location: req.body.location,
                prefferedIndustry: req.body.prefferedIndustry,
                skills: skills,
                empSize: req.body.empSize,
                site: req.body.site,
                aboutid: aboutRecord['_id'],
            });
            logger.debug(companyRecord);
            // Need to update the data in the user model also need to remove console logs once upadted the method properly
            return { companyRecord };
        }
        catch (e) {
            logger.debug(e);
            throw e;
        }
    }
    // GetAppliedCan
    async GetCanList(request) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Submitting the Company Details');
            const companyRecord = await this.companyModel.findById(request.currentUser._id);
            logger.debug(companyRecord);
            const query = { skills: { $in: companyRecord.skills } };
            const candidateRecord = await this.candidateModel.find(query);
            // Need to update the data in the user model also need to remove console logs once upadted the method properly
            return candidateRecord;
        }
        catch (e) {
            throw e;
        }
    }
    async GetCanFromSearch(token, req) {
        const logger = typedi_2.Container.get('logger');
        try {
            logger.debug('Fetching candidates based on skills');
            let query = { skills: { $in: req.query.skills.split(',') } };
            logger.debug(query);
            const candidateRecord = await this.candidateModel.find(query);
            // Need to update the data in the user model also need to remove console logs once upadted the method properly
            return candidateRecord;
        }
        catch (e) {
            throw e;
        }
    }
    async GetCompany(token) {
        try {
            const companyRecord = await this.companyModel.findById(token.currentUser._id);
            const aboutRecord = await this.aboutModel.findById(token.currentUser._id);
            // Need to update the data in the user model also need to remove console logs once upadted the method properly
            return { companyRecord, aboutRecord };
        }
        catch (e) {
            throw e;
        }
    }
};
CompanyService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('companyModel')),
    __param(1, typedi_1.Inject('candidateModel')),
    __param(2, typedi_1.Inject('aboutModel')),
    __param(3, typedi_1.Inject('connectModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CompanyService);
exports.default = CompanyService;
//# sourceMappingURL=company.js.map