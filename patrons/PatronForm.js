import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { Field, reduxForm} from 'redux-form';


export const actionTypes = {'create' : { title: 'Add Patron', submitLabel: 'Save Patron'},
                      'update' : { title: 'Edit Patron', submitLabel: 'Save Changes'}};

// Patrons form for adding or editing patron data
// Uses redux-form (and older version) but that's expected to change.
//
// Not a 'connected' component, thus no manifest; this components gets
// all it needs from 'connected' parent components. 
class PatronForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };


  render() {
    const {
      handleSubmit, 
      pristine,
      reset,
      cancelForm, 
      submitting,
      action,
      initialValues
    } = this.props;
    return (
      <div>
        <Form inline>
          <h3>{action ? action.title : 'Patron'}</h3>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Name
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Patron's name" name="patron_name" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Status
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Patron's status" name="status" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Local Address
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 1
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="First line of local address" name="contact_info.patron_address_local.line1" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 2
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Second line" name="contact_info.patron_address_local.line2" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              City
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="City" name="contact_info.patron_address_local.city" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              State or province
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State or province" name="contact_info.patron_address_local.state_province" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Postal code
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Postal code" name="contact_info.patron_address_local.postal_code" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Note
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Address note" name="contact_info.patron_address_local.address_note" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Start date
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State date" name="contact_info.patron_address_local.start_date" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Home Address
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 1
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="First line of home address" name="contact_info.patron_address_home.line1" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 2
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Second line" name="contact_info.patron_address_home.line2" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              City
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="City" name="contact_info.patron_address_local.city" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              State or province
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State or province" name="contact_info.patron_address_home.state_province" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Postal code
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Postal code" name="contact_info.patron_address_home.postal_code" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Note
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Address note" name="contact_info.patron_address_home.address_note" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Start date
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State date" name="contact_info.patron_address_home.start_date" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Work Address
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 1
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="First line of work address" name="contact_info.patron_address_work.line1" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Line 2
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Second line" name="contact_info.patron_address_work.line2" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              City
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="City" name="contact_info.patron_address_work.city" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              State or province
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State or province" name="contact_info.patron_address_work.state_province" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Postal code
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Postal code" name="contact_info.patron_address_work.postal_code" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Note
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Address note" name="contact_info.patron_address_work.address_note" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Start date
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="State date" name="contact_info.patron_address_work.start_date" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Contact
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Email
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Patron's email" name="contact_info.patron_email" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Alternative email
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Alternative email" name="contact_info.patron_email_alternative" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Cell phone
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Cell phone #" name="contact_info.patron_phone_cell" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Home phone
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Home phone #" name="contact_info.patron_home_phone" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Work phone
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Work phone #" name="contact_info.patron_work_phone" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
            </Col>
            <Col componentClass={ControlLabel} sm={3}>
              Primary contact
            </Col>
            <Col sm={6}>
              <Field component="input" type='text' placeholder="Primary contact info" name="contact_info.patron_primary_contact_info" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Loans
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Total loans" name="total_loans" />
            </Col>
          </Row>
          <br/>
          <Row>
          <Col componentClass={ControlLabel} sm={3}>
              Fines
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Total fines" name="total_fines" />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Fines paid
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Total fines paid" name="total_fines_paid" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Barcode
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Patron's barcode" name="patron_barcode" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Local ID
            </Col>
            <Col sm={9}>
              <Field component="input" type='text' placeholder="Patron's local ID" name="patron_local_id" />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              Patron code
            </Col>
            <Col sm={3}>
              <Field component="input" type='text' placeholder="Code" name="patron_code.value" />
            </Col>
            <Col sm={3}>
              <Field component="input" type='text' placeholder="Description" name="patron_code.description" />
            </Col>
          </Row>
          <br/>
          <ButtonGroup>
            <Button bsStyle='primary' disabled={submitting||pristine} onClick={handleSubmit}>{action ? action.submitLabel : 'Save'}</Button>
            <Button disabled={submitting||pristine} onClick={reset}>Reset</Button>
            <Button disabled={submitting} onClick={cancelForm}>Cancel</Button>  
          </ButtonGroup>
        </Form>
        <br/>
        <br/>
      </div>
    );
  }
}

export default reduxForm(
  {
    form: 'patronForm'
  }
)(PatronForm);

