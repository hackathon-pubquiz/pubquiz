import React, { Component } from "react";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      groups: []
    };
  }

  componentDidMount() {
    fetch("/api/groups")
      .then(res => res.json())
      .then(
        result => {
          this.setState({ isLoaded: true, groups: result });
        },
        error => {
          this.setState({ isLoaded: true, error: error });
        }
      );
  }

  render() {
    const { error, isLoaded, groups } = this.state;
    const groupItems = groups.map(group => <div>{group.name}</div>);

    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Loading...</div>;
    else return <div>Groups:{groupItems}</div>;
  }
}

export default Groups;
