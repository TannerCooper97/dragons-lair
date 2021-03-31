//require bcryptjs as a variable called bcrypt.
const bcrypt = require('bcryptjs');

module.exports = {

    //Next, create a register method with parameters req and res. We will use async and await, so make sure to use the async keyword before the function.
  register: async (req, res) => {
    //Destructure username, password and isAdmin from req.body.
    const { username, password, isAdmin } = req.body;

    //Get the database instance and run the sql file get_user, passing in username. 
    //This query will check the database to see if the username is already taken. 
    //Since this query is asynchronous, make sure to use the await keyword to ensure that the promise resolves before the rest of the code executes.
    const db = req.app.get('db');
    const result = await db.get_user([username]);

    //Set the value of this SQL query to a variable called result.
    //Remember that SQL queries come back in an array, so take the first item of the array and set it to another const variable called existingUser.
    const existingUser = result[0];

    //If existingUser is defined, send a response with status 409 and the text 'Username taken');
    if (existingUser) {
      return res.status(409).send('Username taken');
    }
    //Otherwise, create a const variable called salt, equal to bcrypt.genSaltSync(10).
    const salt = bcrypt.genSaltSync(10);
    //Create a const variable called hash, equal to bcrypt.hashSync(password, salt).
    const hash = bcrypt.hashSync(password, salt);

    //Asynchronously (using await) run the register_user SQL file, passing in isAdmin, username, and hash as parameters (in that order).
    //Store the result to a variable called registeredUser
    const registeredUser = await db.register_user([isAdmin, username, hash]);

    //Store the first item of the registeredUser array to a variable called user.
    //This is our newly created user object.
    const user = registeredUser[0];

    //Set req.session.user to be an object with properties isAdmin, id, and username, equal to user.is_admin, user.id, and user.username.
    req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };

    //Do a res.status and send with the status being 201 for created and send the user object on session we just created.
    return res.status(201).send(req.session.user);
    //Open postman and enter http://localhost:4000/auth/register in the URL input and send the following as
    // {
    //     "username": "mrsmee",
    //     "password": "1stM84Lyfe",
    //     "isAdmin": false
    //   }
  },
  
    //Create a property called login on the authController exports object, with the value of an async function that takes a req and res parameter.
  login: async (req, res) => {
    //Destructure username and password from req.body, storing them on const variables.
    const { username, password } = req.body;
    //Get the database instance using req.app.get('db')
    //Using the get_user SQL file, query the database for a user with a username matching the username from req.body. 
    //Make sure to use the await keyword to ensure the promise resolves before referencing the data.
    const foundUser = await req.app.get('db').get_user([username]);
    //Store the result of the SQL query on a const variable called foundUser.
    //Remember that SQL queries come back in an array, so take the first item of the foundUser array and set it to another const variable called user.
    const user = foundUser[0];
    if (!user) {
      return res.status(401).send('User  not found. Please register as a new user before logging in.');
    }
    //Otherwise, create a const variable called isAuthenticated and set it equal to bcrypt.compareSync(password, user.hash). 
    //This method compares the password entered by the user at login to the hashed and salted version stored in the database.
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    //If isAuthenticated is false, send a response with status code 403, and the string 'Incorrect password'.
    if (!isAuthenticated) {
      return res.status(403).send('Incorrect password');
    }
    //Otherwise, set req.session.user to be an object with the same properties as the user object from the register endpoint, but using the data retrieved from the get_user query.
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
    return res.send(req.session.user);
  },
    //Go back to authController.js and create a logout property with the value of an async function with parameters req and res
    logout: (req, res) => {
    //This function should run req.session.destroy(). As the name implies, this destroys the data stored on the user's session object, effectively logging the user out.
        req.session.destroy();
        //Then send a response with a status of 200.
        return res.sendStatus(200);
        //Test your endpoint with Postman. Send a GET request to http://localhost:4000/auth/logout. You should receive OK as a response.
    }
  
};