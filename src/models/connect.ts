import { IConnect } from '@/interfaces/IConnect';
import mongoose from 'mongoose';

const Connect = new mongoose.Schema(
  {
    _id: { 
      type: String,     // this will be generated using the candidate id and the job slug
      required: true,
    },
    candidateid: {      // here we will populate the candidate id who is applying for the job
      type: String,
    },
    companyid: {        // here we will set the company id for whom the applicant is applying too.
      type: String,
    },
    status: {           // here we will set the status of the job wether the job is opened or closed for the given candidate
      type: Number,
    },
    jobslug: {          // here we add the job slug so as to quick search based on the job slug.
      type: String,
    }
  },
);


export default mongoose.model<IConnect & mongoose.Document>('Connect', Connect);