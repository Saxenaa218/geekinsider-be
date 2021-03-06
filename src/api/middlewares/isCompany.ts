const isCompany = (req, res, next) => {
  /**
   *   middlewares.isRole we will this middle ware to see the different actions
   */
  try {
    if (req.currentUser.role == 'userRecruiter') {
      return next();
    } else {
      return res.sendStatus(401);
    }
  } catch (e) {
    return next(e);
  }
};

export default isCompany;
