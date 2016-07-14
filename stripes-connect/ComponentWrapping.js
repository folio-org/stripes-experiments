import React, { Component } from 'react';

let Wrapping = (Wrapped) => class extends React.Component {

	constructor() {
        super();
  }

  componentDidMount() {
	  this.props.refreshRemote();
  }

  render () {
    return (
      <Wrapped {...this.props} />
    );
  }
};

export default Wrapping;
