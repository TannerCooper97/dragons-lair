module.exports = {
    //Create a method called usersOnly with the parameters req, res, and next.
    usersOnly: (req, res, next) => {
    //The usersOnly function should check if there is a user object on req.session.
      if (!req.session.user) {
    //If there is not, send a response with status 401 and the string 'Please log in'.
        return res.status(401).send('Please log in');
      }
    //Otherwise invoke next.
      next();
    },
    //Create a new method on the module.exports object called adminsOnly with the properties req, res, and next.
    adminsOnly: (req, res, next) => {
    //Use an if statement to check if the isAdmin property on req.session.user is false.
        if (!req.session.user.isAdmin) {
    //Inside the if block, respond with a status of 403 and a string of 'You are not an admin'.
          return res.status(403).send('You are not an admin');
        }
    //Outside of the if statement, call next()
        next();
      }
  };