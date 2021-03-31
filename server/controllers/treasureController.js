//Set module.exports to an object that will store our methods.
module.exports = {

//Create an async method called dragonTreasure with parameters req and res
    dragonTreasure: async (req, res) => {
//This should get the database instance and run the get_dragon_treasure SQL file, passing in the number '1'.
//Use the await keyword on the database query and store the result on a variable.
      const treasure = await req.app.get('db').get_dragon_treasure(1);
//Return the result of this database query as the response with status 200. 
      return res.status(200).send(treasure);
    },

//Go to treasureController.js and create an async method called getUserTreasure with parameters req and res.
    getUserTreasure: async (req, res) => {
//This should get the database instance and run the get_user_treasure SQL file, passing in the id from req.session.user.
//Use the await keyword on the database query, and store the result on a variable.
        const userTreasure = await req.app.get('db').get_user_treasure([req.session.user.id]);
//Send the result of this database query as the response with status 200.
        return res.status(200).send(userTreasure);
      },

//Open the treasureController.js file and create another method called addUserTreasure. 
//This is going to be asynchronous, so be sure to use async and await.
      addUserTreasure: async (req, res) => {
//Destructure treasureURL from req.body and id from req.session.user.
        const { treasureURL } = req.body;
        const { id } = req.session.user;
//Set the result of your query to a variable named userTreasure.
//Get the database connection and invoke the add_user_treasure SQL file passing in treasureURL and id as arguments.
        const userTreasure = await req.app.get('db').add_user_treasure([treasureURL, id]);
//Send the results of this SQL query as the response with a 200 status code.
        return res.status(200).send(userTreasure);
      },

//Go to treasureController.js and create an async method called getAllTreasure with parameters req and res.      
      getAllTreasure: async (req, res) => {
//Get the database instance and run the get_all_treasure SQL file.   
//Use the await keyword on the database query and store the result on a variable.       
        const allTreasure = await req.app.get('db').get_all_treasure();
//Send a response with the result of this database query with status 200.        
        return res.status(200).send(allTreasure)
      }


  };