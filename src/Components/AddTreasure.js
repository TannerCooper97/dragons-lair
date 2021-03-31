import React, { Component } from 'react';
import axios from 'axios';

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: '',
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {

    //In the AddTreasure component there is a method called addTreasure. 
    //This method should use axios to make a POST request to '/api/treasure/user', with an object containing the treasureURL value from state.
    const { treasureURL } = this.state;
    axios
      .post('/api/treasure/user', { treasureURL: treasureURL })
    //In the .then, call this.props.addMyTreasure, which was has already been passed as a prop from <Treasure /> and pass in res.data. 
    //Then call this.setState with treasureURL set to an empty string to clear the input field.
      .then(res => {
        this.props.addMyTreasure(res.data);
        this.setState({ treasureURL: '' });
      })
    //Chain a .catch on to the .then and pass an arrow function referencing the error as a parameter that uses an alert() to alert error.response.request.response.
      .catch(error => {
        console.log(error);
        alert(error.response.request.response)
      });
    //Test App
  }

  render() {
    return (
      <div className="addTreasure">
        <input
          type="text"
          placeholder="Add image URL"
          onChange={e => this.handleInput(e)}
          value={this.state.treasureURL}
        />
        <button onClick={() => this.addTreasure()}>Add</button>
      </div>
    );
  }
}
