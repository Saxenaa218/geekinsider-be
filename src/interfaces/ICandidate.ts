/*
 * These below interfaces are used to create a candidate and fetch candidate details
 */

export interface ICandidate {
  name: string; // Here we enter the name for a given candidate
  whatsappNumber: string; // Here we enter the whatsapp number for a given candidate
  jobTitle: string; // Here we enter the jobtitle for the current candidate
  location: string; // Here we enter the cuurrent location of the candidate
  skills: []; // Here we enter the skills for a given candidate
  exp: string; // Here we enter the current exp for a given candidate
  ctc: string; // Here we enter the current ctc for a given candidate
  githubUrl: string; // the github url corresponds to the git url for the given candidate
  aboutid: string; // about id corresponds to the id of the about section which will be used for better filtering in the search engine
}

// export interface ICandidateInputDTO {
//     name: string;
//     whatsappNumber: string;
//     skills:[];
//     jobtitle: string;
// }
