import React, { Component } from 'react';
import { Link } from 'react-router';

export default class ConsoleMenu extends Component {

  render() {
    const { pathname } = this.props;
    return <div>Okapi Console Menu
      [<Link to={'/okapi-console/tenants'}>Tenants</Link>]
      [<Link to={'/okapi-console/modules'}>Modules</Link>]
      [<Link to={'/okapi-console/health/health'}>Health</Link>]
      [<Link to={'/okapi-console/health/healthconnected'}>Health Connected</Link>]
    </div>;
  }
}