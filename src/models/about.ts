import { IAbout } from '@/interfaces/IAbout';
import mongoose from 'mongoose';

const About = new mongoose.Schema({
  _id: {
    type: String, // this will be used as email id attribute in future currently it will be based on cognito user id
    required: true,
  },
  about: {
    type: String, // This is the para that will be used for about of candidate , company and job
    required: true,
  },
});

export default mongoose.model<IAbout & mongoose.Document>('About', About);
