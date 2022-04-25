import { ICompany } from '@/interfaces/ICompany';
import mongoose from 'mongoose';

const Company = new mongoose.Schema({
  _id: {
    type: String, // this will be used as cognito user id attribute
    required: true,
    unique: true,
  },
  name: {
    // name = name of the company or recruiter
    type: String,
    required: true,
  },
  whatsappNumber: {
    // whatsapp number of the company
    type: String,
  },
  location: {
    // Location tells where the company is located at.
    type: String,
  },
  preferredIndustry: {
    // preferred industry is to tell which is the companys preferred domain
    type: String,
  },
  skills: [], // we will hav eto add a limiting condition to the skills so as to advoid data flow conjestion
  aboutid: {
    // Here we enter the about id for a given candidate which will link to the about of a given candidate
    type: String,
  },
  empSize: {
    // tells us the strength of the company
    type: Number,
  },
  site: {
    // This will be used to store the site of the company
    type: String,
  },
  jobCount: {
    // Here we enter the about id for a given candidate which will tell us the number of jobs a company has opted for
    type: Number,
    default: 0,
  },
  jobs: [], // Here we keep the list of job id's
});

export default mongoose.model<ICompany & mongoose.Document>('Company', Company);
