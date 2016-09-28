import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {Field, reduxForm} from 'redux-form';
import ModuleList from '../modules/ModuleList';
import ModuleSelector from './ModuleSelector';

class TenantForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    submitLabel: PropTypes.string,
    disableFields: PropTypes.bool
  };

  static defaultProps = {
    submitLabel: 'Submit',
    disableFields: false,
    tenantModules: []
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      reset, 
      cancelForm, 
      submitLabel, 
      disableFields
    } = this.props;
    let tenantid = (this.props.initialValues ? this.props.initialValues.id : null);
    return (
      <div>
        <Form inline>
          <h3>{(submitLabel==='Add' ? 'Add ' :
                 (submitLabel==='Save' ? 'Edit ' :
                   (submitLabel === 'Delete' ? 'Delete ' : '') : '') : '')}
          Tenant</h3>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Name
            </Col>
            <Col sm={10}>
              <Field name="name" component="input" type='text' disabled={disableFields} placeholder="Tenant's name" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Description
            </Col>
            <Col sm={10}>
              <Field name="description" component="input" type='text' disabled={disableFields} placeholder='Description of this tenant' />
            </Col>
          </Row>
          <br/>
          <ButtonGroup>
            <Button bsStyle='primary' disabled={pristine || submitting} onClick={handleSubmit}>{submitLabel} Tenant</Button>
            <Button disabled={ pristine || submitting } onClick={reset}>Reset</Button>
            <Button disabled={submitting} onClick={cancelForm}>Cancel</Button>  
          </ButtonGroup>
        </Form>
        <br/>
        {tenantid ? <ModuleSelector tenantid={tenantid} /> : null}
      </div>

    );
  }
}

export default reduxForm(
  {
    form: 'tenantForm'
  }
)(TenantForm);
