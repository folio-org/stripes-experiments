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

  static defaultProps = {
  };

  render() {
    const {
      fields: {patron_name},
      handleSubmit, 
      cancelForm, 
      resetForm, 
      submitting
    } = this.props;
    return (
      <div>
        <Form inline>
          <h3>Add Patron</h3>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Name
            </Col>
            <Col sm={10}>
              <FormControl type='text' placeholder="Patron's name" {...patron_name} />
            </Col>
          </Row>
          <br/>
          <ButtonGroup>
            <Button bsStyle='primary' disabled={submitting} onClick={handleSubmit}>Save Patron</Button>
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
    fields: ['patron_name']
  }
)(PatronForm);
