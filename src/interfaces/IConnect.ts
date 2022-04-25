/*
 * These below interfaces are used to create a connect between the user and the recruiter
 */

export interface IConnect {
  candidateid: string; // here we will populate the candidate id who is applying for the job
  companyid: string; // here we will set the company id for whom the applicant is applying too.
  status: number; // here we will set the status of the job wether the job is opened or closed for the given candidate
  jobslug: string; // here we add the job slug so as to quick search based on the job slug.
}
