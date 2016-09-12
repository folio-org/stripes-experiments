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
    this.props.mutator['deployment_modules'].create(data).then(() =>
      this.props.refreshRemote(this.props)
    );
  }

  deleteDeploy (data) {
    this.props.mutator['deployment_modules'].delete(data).then(() =>
      this.props.refreshRemote(this.props)
    );
  }

  render () {

    const srvcId = this.props.srvcId;
    
    let nextindex=this.props.data['discovery_modules'].length;
    let discoveryNodes = this.props.data['discovery_nodes'];
    if (discoveryNodes.length==0) {
      return <div/>
    }
    return (
     <div>
     {this.props.data['discovery_modules'].map((deployment, index) =>
       {if (deployment.srvcId===srvcId) {
         return (
        <DeploymentForm
          key={index}
          deployNodes={discoveryNodes}
          formKey={index.toString()}
          initialValues={deployment}
          onSubmit={this.deleteDeploy.bind(this)}
          disable={true} />);
       }}
      )}
     <br/>
     <DeploymentForm 
       key={nextindex}
       deployNodes={discoveryNodes}
       formKey={nextindex.toString()}
       initialValues={ {srvcId: srvcId} }
       onSubmit={this.addDeploy.bind(this)}
       disable={false}/>
     </div>
    );
  }
}

export default connect(Deployments, 'okapi-console');