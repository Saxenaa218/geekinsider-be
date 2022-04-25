import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('../models/user').default,
  };

  const gitModel = {
    name: 'gitModel',
    // Notice the require syntax and the '.default'
    model: require('../models/git').default,
  };

  const candidateModel = {
    name: 'candidateModel',
    // Notice the require syntax and the '.default'
    model: require('../models/candidate').default,
  };

  const companyModel = {
    name: 'companyModel',
    // Notice the require syntax and the '.default'
    model: require('../models/company').default,
  };

  const aboutModel = {
    name: 'aboutModel',
    // Notice the require syntax and the '.default'
    model: require('../models/about').default,
  };

  const jobModel = {
    name: 'jobModel',
    // Notice the require syntax and the '.default'
    model: require('../models/job').default,
  };

  const connectModel = {
    name: 'connectModel',
    // Notice the require syntax and the '.default'
    model: require('../models/connect').default,
  };
  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [userModel, candidateModel, companyModel, aboutModel, jobModel, connectModel, gitModel],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
