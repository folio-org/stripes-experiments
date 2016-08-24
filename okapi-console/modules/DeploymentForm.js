import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {reduxForm} from 'redux-form';


class DeploymentForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,  
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: {srvcId, instId, nodeId, descriptor},
      deployNodes,
      handleSubmit,       
      resetForm,
      handleDelete,       
      submitting,
      disable
    } = this.props;
	  return (
      <Form horizontal >
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Service ID
          </Col>
          <Col sm={10}>
            <FormControl type="text" disabled={true} placeholder="Service/module ID  " {...srvcId} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Inst ID
          </Col>
          <Col sm={10}>
            <FormControl type="text" disabled={true} placeholder="Instance ID  " {...instId} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Node
          </Col>
          <Col sm={10}>
            <FormControl componentClass="select" placeholder="select deployment node" {...nodeId}
              value={nodeId.value || ''} disabled={disable}>
              <option></option>
              {deployNodes.map((aNode,index) => 
                <option value={aNode.nodeId} key={aNode.nodeId}>{aNode.url}</option>
              )}
            </FormControl>            
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Exec
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Exec " {...(descriptor.exec)} disabled={disable}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Start command
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Command line start " {...(descriptor.cmdlineStart)} disabled={disable}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Stop command
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Command line stop " {...(descriptor.cmdlineStop)} disabled={disable}/>
          </Col>
        </FormGroup>
        { disable ?
            <ButtonGroup className="pull-right">
               <Button bsStyle="warning" disabled={submitting} onClick={handleSubmit}>Delete</Button> 
            </ButtonGroup>
           :
            <ButtonGroup className="pull-right">
                <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>Submit</Button>
                <Button disabled={submitting} onClick={resetForm}>Reset</Button>
            </ButtonGroup>
        }
        <br/><br/>
      </Form>
    );
  }
}

export default reduxForm(
  {
    form: 'deploymentForm',
    fields: ['srvcId', 'instId', 'nodeId', 
             'descriptor', 
              'descriptor.cmdlineStart', 'descriptor.cmdlineStop', 'descriptor.exec' ]
  },
)(DeploymentForm);
