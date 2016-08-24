import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class ModuleList extends Component {
  static manifest = {
    'modules': { type: 'okapi',
                 path: '_/proxy/modules' }
  };

  render() {
    if (!('modules' in this.props.data)) return null;
    var moduleNodes = this.props.data['modules'].map((amodule) => {
      return (
        <li key={amodule.id}>
          {amodule.name}&nbsp;
          [<Link to={'/okapi-console/modules/edit/' + amodule.id}>Edit</Link>]
          [<a onClick={() => this.props.mutator['modules'].delete(amodule)}>delete</a>]
        </li>
      );
    });
    return (
      <div>
        <div>
        <h3>Module list:</h3>
        <ul>
          {moduleNodes}
        </ul>
        </div>
        <Link to={'/okapi-console/modules/add'}>Add module</Link>
      </div>
    );
  }
}

export default connect(ModuleList, 'okapi-console');