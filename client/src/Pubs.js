import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

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
    const { t } = this.props;
    const pubItems = pubs.map(pub => <div key={pub.id}>{pub.name}</div>);

    if (error) return <div>{t("error",{message: error.message})}</div>;
    else if (!isLoaded) return <div>{t("loading")}</div>;
    else return <div>{t("pubs", {pubs: pubItems})}</div>;
  }
}

export default withTranslation()(Pubs);
