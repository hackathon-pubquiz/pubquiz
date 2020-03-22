import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

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
    const { t } = this.props;
    const peopleItems = people.map(person => (
      <div key={person.id}>{person.nickname}</div>
    ));

    if (error) return <div>{t("error",{message: error.message})}</div>;
    else if (!isLoaded) return <div>{t("loading")}</div>;
    else return <div>{t("people")}:{peopleItems}</div>;
  }
}

export default withTranslation()(Persons);
