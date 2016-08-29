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
    let node = this.props.data['discovery_nodes'].find( (node) => node.nodeId == data.nodeId )
    this.props.mutator['deployment_modules'].create(data);
    this.props.refreshRemote(this.props);
    //TODO: We lack Promises: we need to wait for deployment update to finish before fetching discovery_modules
    //      but we can't do like this now:
    //let promise = this.props.dispatch(okapicrud.create('deployment_modules', data, { okapiurl: node.url}));
    //promise.then(() =>  { this.props.dispatch(okapicrud.fetch('discovery_modules')); });
  }

  deleteDeploy (data) {
    let node = this.props.data['discovery_nodes'].find( (node) => node.nodeId == data.nodeId )
    this.props.mutator['deployment_modules'].delete(data);
    this.props.refreshRemote(this.props);
    //TODO: We lack Promises: we need to wait for deployment update to finish before fetching discovery_modules
    //      but we can't do like this now:
    //let promise = this.props.dispatch(okapicrud.delete('deployment_modules',data, { okapiurl: node.url }));
    //promise.then(() => { this.props.dispatch(okapicrud.fetch('discovery_modules')); });
  }

  render () {

    const srvcId = this.props.srvcId;
    const { discovery_modules, discovery_nodes } = this.props.data;
    
    let nextindex=discovery_modules.length;
    return (
     <div>
     {discovery_modules.map((deployment, index) =>
       {if (deployment.srvcId===srvcId) {
         return (
        <DeploymentForm
          key={index}
          deployNodes={discovery_nodes}
          formKey={index.toString()}
          initialValues={deployment}
          onSubmit={this.deleteDeploy.bind(this)}
          disable={true} />);
       }}
      )}
     <br/>
     <DeploymentForm 
       key={nextindex}
       deployNodes={discovery_nodes}
       formKey={nextindex.toString()}
       initialValues={ {srvcId: srvcId} }
       onSubmit={this.addDeploy.bind(this)}
       disable={false}/>
     </div>
    );
  }
}

export default connect(Deployments, 'okapi-console');