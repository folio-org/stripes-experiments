import React, { Component, PropTypes } from 'react'
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import { Field, FieldArray, reduxForm } from 'redux-form'

class DeploymentForm extends Component {

  render() {
    const {
      deployNodes,
      handleSubmit,
      reset,
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
            <Field name="srvcId" type="text" component="input" placeholder="Service/module ID  " disabled={true} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Inst ID
          </Col>
          <Col sm={10}>
            <Field name="instId" type="text" component="input" placeholder="Instance ID  " disabled={true} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Node
          </Col>
          <Col sm={10}>
            <Field name="nodeId" component="select" placeholder="select deployment node" disabled={disable} >
              <option></option>
              {deployNodes.map((aNode,index) => 
                <option value={aNode.nodeId} key={aNode.nodeId}>{aNode.url}</option>
              )}
            </Field>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Exec
          </Col>
          <Col sm={10}>
            <Field name="descriptor.exec" component="input" type="text" placeholder="Exec " disabled={disable}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Start command
          </Col>
          <Col sm={10}>
            <Field name="descriptor.cmdlineStart" component="input" type="text" placeholder="Command line start " disabled={disable}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            Stop command
          </Col>
          <Col sm={10}>
            <Field name="descriptor.cmdlineStop" component="input" type="text" placeholder="Command line stop " disabled={disable}/>
          </Col>
        </FormGroup>
        { disable ?
            <ButtonGroup className="pull-right">
               <Button bsStyle="warning" disabled={submitting} onClick={handleSubmit}>Delete</Button> 
            </ButtonGroup>
           :
            <ButtonGroup className="pull-right">
                <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>Submit</Button>
                <Button disabled={submitting} onClick={reset}>Reset</Button>
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
    enableReinitialize: true
  },
)(DeploymentForm);
