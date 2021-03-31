require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const PORT = 4000;

//In index.js, destructure CONNECTION_STRING and SESSION_SECRET from process.env, storing it on a const variable.
const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());
app.post('/auth/register', authCtrl.register);

//Create a POST endpoint with '/auth/login' as the URL and authCtrl.login as the controller function.
app.post('/auth/login', authCtrl.login);

//Go to server/index.js and create a GET endpoint with url '/auth/logout' and method authCtrl.logout
app.get('/auth/logout', authCtrl.logout);

//Create a get endpoint, '/api/treasure/dragon', with the function treasureCtrl.dragonTreasure.
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);

//Now go to server/index.js and create a get endpoint, '/api/treasure/user', with the function treasureCtrl.getUserTreasure.
//Apply the usersOnly middleware that we have just created by referencing the middleware function between the endpoint path and the controller function.
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);

//The endpoint url should be '/api/treasure/user' and treasureCtrl.addUserTreasure should be the controller function that runs when this endpoint is hit.
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

//Now go to server/index.js, create a get endpoint, '/api/treasure/all', with the function treasureCtrl.getAllTreasure.
//Since we only want users that are logged in to interact with this endpoint, add the usersOnly middleware function between the route path and the controller. 
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);

//Now that the middleware has been defined, go to server/index.js and add the find the GET request to /api/treasure/all.
//Add the auth.adminsOnly middleware function after the auth.usersOnly middleware function, but before the treasureCtrl.getAllTreasure controller function.
// * This middleware function should now be able to ensure that a user is an admin before the request gets passed on to the final controller function.
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
//Now go to server/index.js and create a get endpoint, '/api/treasure/user', with the function treasureCtrl.getUserTreasure.
// {
// 	"username": "mrsmee",
// 	"password": "1stM84Lyfe"
// }
//Now test your GET endpoint using postman by making a GET request to http://localhost:4000/api/treasure/user.
//You should receive [] as a response since the user currently has no treasure in the database.


//Set up session as top-level middleware by invoking app.use and passing in session invoked with a configuration object.
//The session configuration object should have properties resave set to true, saveUninitialized set to false, and secret set to SESSION_SECRET.
app.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET,
    })
  );
  
//Create the database connection by invoking massive and passing in the CONNECTION_STRING.
//Add a .then on the massive invocation passing in a function, and store the resulting database connection using app.set.
massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  app.listen(PORT, () =>
    console.log(`Db connnected, Listening with all my heart! port: ${PORT}`)
  );


});

