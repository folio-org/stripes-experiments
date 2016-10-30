import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class ModuleList extends Component {
  static manifest = {
    'modules': { type: 'okapi',
                 path: '_/proxy/modules'
               }
  };

  render() {
    const { data: {modules}, mutator, pathname } = this.props;

    if (!modules) return null;
    var moduleNodes = modules.map((amodule) => {
      return (
        <li key={amodule.id}>
          {amodule.name}&nbsp;
          [<Link to={`${pathname}/edit/${amodule.id}`}>Edit</Link>]
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
         <Link to={`${pathname}/add`}>Add module</Link>
      </div>
    );
  }
}

export default connect(ModuleList, 'okapi-console');