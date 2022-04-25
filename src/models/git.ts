import { IGit } from '@/interfaces/IGit';
import mongoose from 'mongoose';

const Git = new mongoose.Schema({
  _id: {
    type: String, // this will be used as email id attribute
    required: true,
  },
  repoCount: {
    // total public repo count of a givven git user
    type: Number, // this will be used as email id attribute
    required: true, // https://api.github.com/users/vishaljkk
  },
  repoName: [], //// To define reponames - https://api.github.com/repos/git-username/repos
  skills: [], // Skills in the order in which are feched from the github api
  skillsOrder: [], // Numeric factor to skills order
});

export default mongoose.model<IGit & mongoose.Document>('Git', Git);
