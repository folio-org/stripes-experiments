import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {Field, FieldArray, reduxForm} from 'redux-form';
import Deployments from './Deployments';

class ModuleForm extends Component {
  static propTypes = {
    cancelForm: PropTypes.func.isRequired,
    submitLabel: PropTypes.string,
    disableFields: PropTypes.bool
  };

  static defaultProps = {
    submitLabel: 'Submit',
    disableFields: false
  };

  render() {
    const {
      handleSubmit, 
      pristine,
      reset,
      submitting,
      cancelForm, 
      submitLabel
    } = this.props;

    return (
      <Form inline>
            <h3>{(submitLabel==='Add' ? 'Add ' :
                   (submitLabel==='Save' ? 'Edit ' :
                     (submitLabel === 'Delete' ? 'Delete ' : '') : '') : '')} module proxy</h3>
            <Row>
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <Field name="name" component="input" type='text' placeholder='Module name' />
              </Col>
            </Row>
            <br/>
            <FieldArray name="provides" component={renderProvides} />
            <br/>
            <FieldArray name="requires" component={renderRequires} />
            <br/>
            <FieldArray name="routingEntries" component={renderRoutingEntries} />
            <ButtonGroup className='pull-right'>
              <Button type='submit' bsStyle='primary' disabled={submitting||(pristine)} onClick={handleSubmit}>{submitLabel} module proxy</Button>
              <Button type='reset' disabled={submitting||pristine} onClick={reset}>Reset</Button>
              <Button type='button' disabled={submitting} onClick={cancelForm}>{pristine? 'Go back' : 'Cancel'}</Button>
            </ButtonGroup>
      </Form>)  
  }
}

const renderProvides = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Provides</button>
    </li>
    {fields.map((fld, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Provision"
          onClick={() => fields.remove(index)}/>
        <h4>Provision #{index + 1}</h4>
        <Field
          name={`${fld}.id`}
          type="text"
          component="input"
          placeholder="Module ID"/>
        <br/>
        <Field
          name={`${fld}.version`}
          type="text"
          component="input"
          placeholder="Version"/>
      </li>
    )}
  </ul>
)

const renderRequires = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Requirements</button>
    </li>
    {fields.map((fld, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove requirement"
          onClick={() => fields.remove(index)}/>
        <h4>Requirement #{index + 1}</h4>
        <Field
          name={`${fld}.id`}
          type="text"
          component="input"
          placeholder="Module ID"/>
        <br/>
        <Field
          name={`${fld}.version`}
          type="text"
          component="input"
          placeholder="Version"/>
      </li>
    )}
  </ul>
)

const renderRoutingEntries = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Routing</button>
    </li>
    {fields.map((fld, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove routing"
          onClick={() => fields.remove(index)}/>
        <h4>Route #{index + 1}</h4>
        <Field
          name={`${fld}.path`}
          type="text"
          component="input"
          placeholder="Path to module"/>
        <br/>
        <Field
          name={`${fld}.level`}
          type="text"
          component="input"
          placeholder="Level"/>
        <br/>
        <Field
          name={`${fld}.type`}
          type="text"
          component="input"
          placeholder="Request type"/>

      </li>
    )}
  </ul>
)



export default reduxForm(
  {
    form: 'moduleForm'
  }
)(ModuleForm);

