import React, { Component } from "react";

class Persons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      people: []
    };
  }

  componentDidMount() {
    fetch("/api/persons")
      .then(res => res.json())
      .then(
        result => {
          this.setState({ isLoaded: true, people: result });
        },
        error => {
          this.setState({ isLoaded: true, error: error });
        }
      );
  }

  render() {
    const { error, isLoaded, people } = this.state;
    const peopleItems = people.map(person => <div>{person.nickname}</div>);

    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Loading...</div>;
    else return <div>People:{peopleItems}</div>;
  }
}

export default Persons;
