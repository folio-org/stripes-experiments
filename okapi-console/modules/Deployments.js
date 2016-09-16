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

    if (! discovery_modules || ! discovery_nodes  ) return <div/>;
    let modulesBySrvcId = discovery_modules.filter(
               (depl,index,arr) => { return depl.srvcId===srvcId;})
    let nextindex=modulesBySrvcId.length;
    return (
     <div>
     {modulesBySrvcId.map((deployment, index) =>
       {
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