import React, { Component } from "react";

class Pubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      pubs: []
    };
  }

  componentDidMount() {
    fetch("/api/pubs")
      .then(res => res.json())
      .then(
        result => {
          this.setState({ isLoaded: true, pubs: result });
        },
        error => {
          this.setState({ isLoaded: true, error: error });
        }
      );
  }

  render() {
    const { error, isLoaded, pubs } = this.state;
    const pubItems = pubs.map(pub => <div>{pub.name}</div>);

    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Loading...</div>;
    else return <div>Pubs:{pubItems}</div>;
  }
}

export default Pubs;
