import { ICandidate } from '@/interfaces/ICandidate';
import mongoose from 'mongoose';

const Candidate = new mongoose.Schema({
  _id: {
    type: String, // this will be used as email id attribute
    required: true,
    unique: true,
    index: true,
  },
  name: {
    // Here we enter the name for a given candidate
    type: String,
    required: true,
  },
  whatsappNumber: {
    // Here we enter the whatsapp number for a given candidate
    type: String,
  },
  jobTitle: {
    // Here we enter the jobtitle for the current candidate
    type: String,
  },
  location: {
    // Here we enter the cuurrent location of the candidate
    type: String,
  },
  githubUrl: {
    // the github url corresponds to the git url for the given candidate
    type: String,
  },
  ctc: {
    // Here we enter the current ctc for a given candidate
    type: String,
  },
  exp: {
    // Here we enter the current exp for a given candidate
    type: String,
  },
  skills: [], // Here we enter the skills for a given candidate
  aboutid: {
    // Here we enter the about id for a given candidate which will link to the about of a given candidate
    type: String,
  },
});

export default mongoose.model<ICandidate & mongoose.Document>('Candidate', Candidate);
