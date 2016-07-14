import React, { Component } from 'react';

let Wrapping = (Wrapped) => class extends React.Component {

	constructor() {
        super();
  }

  componentDidMount() {
    console.log("got ID from route?: ",this.props.params.id);
	  this.props.refreshRemote();
  }

  render () {
    return (
      <Wrapped {...this.props} />
    );
  }
};

export default Wrapping;
