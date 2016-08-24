import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {reduxForm} from 'redux-form';
import ModuleList from '../modules/ModuleList';
import ModuleSelector from '../tenantModules/ModuleSelector';

class TenantForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
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
      fields: {id, name, description},      
      handleSubmit, 
      cancelForm, 
      resetForm, 
      submitting,
      submitLabel, 
      disableFields
    } = this.props;
    let tenantid = (this.props.fields ? this.props.fields.id.value : null);
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
              <FormControl type='text' disabled={disableFields} placeholder="Tenant's name" {...name} />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Description
            </Col>
            <Col sm={10}>
              <FormControl type='text' disabled={disableFields} placeholder='Description of this tenant' {...description} />
            </Col>
          </Row>
          <br/>
          <ButtonGroup>
            <Button bsStyle='primary' disabled={submitting} onClick={handleSubmit}>{submitLabel} Tenant</Button>
            <Button disabled={submitting||disableFields} onClick={resetForm}>Reset</Button>
            <Button disabled={submitting} onClick={cancelForm}>Cancel</Button>  
          </ButtonGroup>
        </Form>
        <br/>
        <ModuleSelector tenantid={tenantid} />
      </div>

    );
  }
}

export default reduxForm(
  {
    form: 'tenantForm',
    fields: ['id','name','description']
  }
)(TenantForm);
