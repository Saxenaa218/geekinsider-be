import { IJob } from '@/interfaces/IJob';
import mongoose from 'mongoose';

const Job = new mongoose.Schema(
  {
    _id: { 
        type: String,       // this will be used as email id attribute
        required: true,
    },
    exp:{                   // Here we enter the exp for a given job
        type: Number,
    },
    ctc:{                   // Here we enter the current ctc for a given job
        type: Number,
    },
    companyName:{           // Here we enter the company Name
        type: String,
        required: true
    },
    companyId:{
        type: String,
        required: true
    },
    jobTitle: {
        type: String
    },
    jobLocation:{
        type: String
    },
    jobStatus: {
        type: Boolean,
        default: true
    },
    skills:[],          // Here we define the tech skills for a given job
    jobAboutid: {
        type: String
    },
    jobslug:{           // Here we create a jobslug for a given job
        type:String
    },
    canApplied:[],      // we will hav eto add a limiting condition to the skills so as to advoid data flow conjestion
  },
);

export default mongoose.model<IJob & mongoose.Document>('Job', Job);