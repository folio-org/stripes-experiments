import React, { Component, PropTypes } from 'react'
import { connect } from 'stripes-connect';
import DeploymentForm from './DeploymentForm'


export class Deployments extends Component {

  static manifest = { 'discovery_modules':  { type: 'okapi',
                                              path: '_/discovery/modules',
                                              pk: 'instId'
                                            },
                      'discovery_nodes':    { type: 'okapi',
                                              path: '_/discovery/nodes',
                                              pk:   'nodeId'
                                            },
                      'deployment_modules': { type: 'okapi',
                                              path: '_/deployment/modules', 
                                              pk: 'instId',
                                              clientGeneratePk: false
                                            }
                    };

  constructor(props) {
    super(props);
  }

  addDeploy (data) {
    this.props.mutator['deployment_modules'].POST(data).then(() => {
      this.props.refreshRemote(this.props)
    }
    );
  }

  deleteDeploy (data) {
    this.props.mutator['deployment_modules'].DELETE(data).then(() =>
      this.props.refreshRemote(this.props)
    );
  }

  render () {

    const { data: { discovery_modules, discovery_nodes }, 
            srvcId 
          } = this.props;

    if (! discovery_nodes || discovery_nodes.length == 0 ) return <div/>;
    let nextindex = (discovery_modules ? discovery_modules.length : 0);
    return (
     <div>
     {discovery_modules.map
       ((deployment, index) =>
         {
           if (deployment.srvcId===srvcId) {
             return (
               <DeploymentForm
                form={'dep-' + index.toString()}
                key={'dep-' + index.toString()}
                deployNodes={discovery_nodes}
                initialValues={deployment}
                onSubmit={this.deleteDeploy.bind(this)}
                disable={true} />
             );
           }
         }
       )
     }
     <br/>
     <DeploymentForm 
       form={'dep-' + nextindex.toString()}
       key={'dep-' + nextindex.toString()}
       deployNodes={discovery_nodes}
       initialValues={ {srvcId: srvcId} }
       onSubmit={this.addDeploy.bind(this)}
       disable={false}/>
     </div>
    );
  }
}

export default connect(Deployments, 'okapi-console');