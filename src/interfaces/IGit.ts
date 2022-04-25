/*
 * These below interfaces are used to fill git info for a given user
 */

export interface IGit {
  _id: string; // here we use the same cognito id to make as an id in the git interface.
  repoCount: number; // total public repo count of a givven git user
  repoName: []; // To define reponames
  skills: []; // Skills in the order in which are feched from the github api
  skillsOrder: []; // Numeric factor to skills order
}
