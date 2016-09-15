import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class ModuleList extends Component {
  static manifest = {
    'modules': { type: 'okapi',
                 path: '_/proxy/modules' }
  };

  render() {
    const { data, mutator } = this.props;
    
    if (!('modules' in data)) return null;
    var moduleNodes = data['modules'].map((amodule) => {
      return (
        <li key={amodule.id}>
          {amodule.name}&nbsp;
          [<Link to={'/okapi-console/modules/edit/' + amodule.id}>Edit</Link>]
          [<a onClick={() => mutator['modules'].DELETE(amodule)}>delete</a>]
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