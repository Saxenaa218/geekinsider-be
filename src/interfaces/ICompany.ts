/*
 * These below interfaces are used to create a company and fetch company details
 * This will be used for the recruiter to fill their info also.
 */

export interface ICompany {
  name: string; // name = name of the company or recruiter
  whatsappNumber: string; // whatsapp number of the company
  preferredIndustry: string; // preferred industry is to tell which is the companys preferred domain
  location: string; // Location tells where the company is located at.
  skills: []; // skills tell us what is the current skill set of the company
  aboutid: string; // about is corresponds to the id of the about section which will be used for better filtering in the search engine
  empSize: number; // tells us the strength of the company.
  site: string; // This will be used to store the site of the company
}
