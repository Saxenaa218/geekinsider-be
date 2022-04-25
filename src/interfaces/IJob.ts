/*
 * These below interfaces are used to create and fetch jobs for a given user
 */

export interface IJob {
  companyName: string; // Here we enter the company Name
  jobTitle: string; // Here we enter the jobTitle
  jobLocation: string; // Here we enter the job location for which someone is posting a job for
  jobStatus: boolean; // Here we enter the job status to make a job open or close by default is when we create a job the status is set to 1
  jobDescription: string; // Here we get the job description from the about which is then passed to the one who is viweing the job
  skills: string; // Here we define the tech skills for a given job
  jobslug: string; // Here we create a jobslug for a given job
  exp: number; // Here we enter the exp for a given job
  ctc: number; // Here we enter the current ctc for a given job
}
