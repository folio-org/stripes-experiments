import React, { Component } from 'react';

let Wrapping = (Wrapped) => class extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.refreshRemote({...this.props.params});
  }

  render () {
    return (
      <Wrapped {...this.props} />
    );
  }
};

export default Wrapping;
