import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {reduxForm} from 'redux-form';

class PatronForm extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  static actionTypes = {'create' : { title: 'Add Patron', submitLabel: 'Save Patron'},
                        'update' : { title: 'Edit Patron', submitLabel: 'Save Changes'}};

  render() {
    const {
      fields: {patron_name,patron_code,contact_info,total_fines_paid,total_loans,status,patron_barcode,total_fines},
      handleSubmit, 
      cancelForm, 
      resetForm, 
      submitting,
      action
    } = this.props;
    return (
      <div>
        <Form inline>
          <h3>{action ? action.title : 'Patron'}</h3>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Name
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Patron's name" {...patron_name} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Code
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Patron's code" {...patron_code} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              ContactInfo
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Contact Info" {...contact_info} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Fines paid
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Total fines paid" {...total_fines_paid} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Loans
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Total loans" {...total_loans} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Status
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Patron's status" {...status} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Barcode
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Patron's barcode" {...patron_barcode} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Fines
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Total fines" {...total_fines} />
            </Col>
          </Row>

          <br/>
          <ButtonGroup>
            <Button bsStyle='primary' disabled={submitting} onClick={handleSubmit}>{action ? action.submitLabel : 'Save'}</Button>
            <Button disabled={submitting} onClick={resetForm}>Reset</Button>
            <Button disabled={submitting} onClick={cancelForm}>Cancel</Button>  
          </ButtonGroup>
        </Form>
      </div>

    );
  }
}

export default reduxForm(
  {
    form: 'patronForm',
    fields: ['patron_name','patron_code','contact_info','total_fines_paid','total_loans','status','patron_barcode','total_fines']
  }
)(PatronForm);

