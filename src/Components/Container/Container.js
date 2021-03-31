import React, { Component } from 'react'
import './Container.css'
import Treasure from '../Treasure'
import axios from 'axios';

export default class Container extends Component {
  constructor() {
    super()
    this.state = {
      treasures: {},
    }
    this.addMyTreasure = this.addMyTreasure.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ treasures: {} })
    }
  }

  getDragonTreasure() {
  //In the getDragonTreasure() method, make an axios GET request to /api/treasure/dragon.
    axios
      .get('/api/treasure/dragon')
  //Chain a .then and set the data from the response to the treasures object on state on a property called dragon.
  //Make sure to use the spread operator to keep the treasures object immutable.
      .then(treasure => {
        this.setState({
          treasures: {
            ...this.state.treasures,
            dragon: treasure.data,
          },
        });
      })
  //Chain a .catch onto the .then with a console.log of the error
      .catch(error => console.log(error));
  }


  getAllTreasure() {
//Find the getAllTreasure method and use axios to make a GET request to /api/treasure/all.
    axios.get('/api/treasure/all')
//Chain a .then() on the end of .get() method and call this.setState() passing in an object with a treasures property.
    .then( treasure => {
//Since all treasures including dragon, user, and all will be on the same object, we need to use the spread operator to add all current properties to our new object and then define a new all property that will be added to the end of the object.
      this.setState({
        treasures: {
          ...this.state.treasures,
          all: treasure.data
        }
      })
//Chain a .catch() on to the end of the .then() and use an pass in an arrow function with error as a parameter. You should then alert the error.response.request.response.
//referencing .response.request.response on the error object allows us to drill down to the string response that we sent on the server.
    }).catch( error => alert(error.response.request.response))
  }

  getMyTreasure() {
    //In the getMyTreasure() method, use axios to make a GET request to /api/treasure/user.
    axios
      .get('/api/treasure/user')
    //Chain a .then on to the end of the .get method and provide an arrow function with treasure as a parameter.
      .then(treasure => {
    //Call this.setState and pass in an object with a treasures property with the value of an object.
        this.setState({
    //Inside that object, make sure to spread the current properties and values of this.state.treasures before setting the user property to treasure.data.
          treasures: {
            ...this.state.treasures,
            user: treasure.data,
          },
        });
      })
    //Chain a .catch on to the .then that takes an arrow function with error as a parameter and using an alert(), alerts error.response.request.response. This will alert the message that we respond with on the server.
      .catch(error => alert(error.response.request.response));
    //Test App
  }

  addMyTreasure(newMyTreasure) {
    this.setState({
      treasures: {
        ...this.state.treasures,
        user: newMyTreasure,
      },
    })
  }

  render() {
    const { username } = this.props.user
    const { dragon, user, all } = this.state.treasures
    return (
      <div className="Container">
        {dragon ? (
          <div className="treasureBox loggedIn">
            <h1>Dragon's treasure</h1>
            <Treasure treasure={dragon} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getDragonTreasure()}>
              See Dragon's <br /> Treasure
            </button>
            <p>
              This treasure trove does not require a user to be logged in for
              access
            </p>
          </div>
        )}
        {user && username ? (
          <div className="treasureBox loggedIn">
            <h1>
              {this.props.user.username}
              's treasure
            </h1>
            <Treasure treasure={user} addMyTreasure={this.addMyTreasure} />
          </div>
        ) : (
          <div className="treasureBox">
            <button
              className="title"
              onClick={() => this.getMyTreasure()}
              name="user"
            >
              See My <br /> Treasure
            </button>
            <p>
              This treasure trove requires a user to be logged in for access
            </p>
          </div>
        )}
        {all && username ? (
          <div className="treasureBox loggedIn">
            <h1>All treasure</h1>
            <Treasure treasure={all} />
          </div>
        ) : (
          <div className="treasureBox">
            <button
              className="title"
              onClick={() => this.getAllTreasure()}
              name="all"
            >
              See All <br /> Treasure
            </button>
            <p>
              This treasure trove requires a user to be a logged in as an admin
              user for access
            </p>
          </div>
        )}
      </div>
    )
  }
}
