import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { ICandidate } from '@/interfaces/ICandidate';
import { ICompany } from '@/interfaces/ICompany';
import { IAbout } from '@/interfaces/IAbout';
import { IJob } from '@/interfaces/IJob';
import { IConnect } from '@/interfaces/IConnect';
import { IGit } from '@/interfaces/IGit';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type CandidateModel = Model<ICandidate & Document>;
    export type CompanyModel = Model<ICompany & Document>;
    export type AboutModel = Model<IAbout & Document>;
    export type JobModel = Model<IJob & Document>;
    export type ConnectModel = Model<IConnect & Document>;
    export type GitModel = Model<IGit & Document>;
  }
}
