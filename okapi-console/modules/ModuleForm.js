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
      submitLabel,
      initialValues
    } = this.props;

    let id = (initialValues ? initialValues.id : '');
    return (
      <div>
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
        </Form>
        <br/><br/>
        <Deployments srvcId={id ? id : ''} />
      </div>)  
  }
}

const renderProvides = ({ fields }) => (
  <div>
    {!fields.length ?
      <Row key={'new-provides'}>
        <Col sm={2}><ControlLabel>Provides</ControlLabel></Col>
        <Col sm={5}>
          <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
              <Glyphicon glyph='plus' />Add provision
          </Button>
        </Col>
      </Row>
      : ''
    }
    {fields.map((fld, index) =>
        <Row key={'provides'+index}>
          <Col sm={2}>
            {index==0 ? <ControlLabel>Provides</ControlLabel> : ''}
          </Col>
          <Col sm={5}>
            <Field name={`${fld}.id`} type="text" component="input" placeholder="Module ID"/>
          </Col>
          <Col sm={4}>
            <Field name={`${fld}.version`} type="text" component="input" placeholder="Version"/>
          </Col>
          <Col sm={1}>
            {index==0 ?
              <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
                <Glyphicon glyph='plus' />
              </Button>
              :
              <Button type='button' bsStyle='primary' onClick={() => {fields.remove(index)}}>
                <Glyphicon glyph='minus' />
              </Button>
            }
          </Col>
        </Row>
    )}
  </div>
)

const renderRequires = ({ fields }) => (
  <div>
    {!fields.length ?
      <Row key={'new-requires'}>
        <Col sm={2}><ControlLabel>Requires</ControlLabel></Col>
        <Col sm={5}>
          <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
              <Glyphicon glyph='plus' />Add requirement
          </Button>
        </Col>
      </Row>
      : ''
    }
    {fields.map((fld, index) =>
        <Row key={'requires'+index}>
          <Col sm={2}>
            {index==0 ? <ControlLabel>Requires</ControlLabel> : ''}
          </Col>
          <Col sm={5}>
            <Field name={`${fld}.id`} type="text" component="input" placeholder="Module ID"/>
          </Col>
          <Col sm={4}>
            <Field name={`${fld}.version`} type="text" component="input" placeholder="Version"/>
          </Col>
          <Col sm={1}>
            {index==0 ?
              <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
                <Glyphicon glyph='plus' />
              </Button>
              :
              <Button type='button' bsStyle='primary' onClick={() => {fields.remove(index)}}>
                <Glyphicon glyph='minus' />
              </Button>
            }
          </Col>
        </Row>
    )}
  </div>
)

const renderRoutingEntries = ({ fields }) => (
  <div>
    {!fields.length ?
      <Row key={'new-route'}>
        <Col sm={2}><ControlLabel>Routing</ControlLabel></Col>
        <Col sm={5}>
          <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
              <Glyphicon glyph='plus' />Add route
          </Button>
        </Col>
      </Row>
      : ''
    }
    {fields.map((fld,index) =>
      <div key={'route'+index}>
        <Row key={index}>
          <Col sm={2}>
            {index==0 ? <ControlLabel>Routing</ControlLabel> : ''}
          </Col>
          <Col sm={10}>
            <FieldArray name={`${fld}.methods`} component={renderMethods}/>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col sm={1}>{' '}</Col>
          <Col sm={10}>
            <Field name={`${fld}.path`} type="text" component="input" placeholder="Request path to module"/>
            <Field name={`${fld}.level`} type="text" component="input" placeholder="Priority level"/>
            <Field name={`${fld}.type`} type="text" component="input" placeholder="Request type"/>
          </Col>
          <Col sm={1}>
            {index==0 ?
              <Button type='button' bsStyle='primary' onClick={() => {fields.push({})}}>
                <Glyphicon glyph='plus' />
              </Button>
              :
              <Button type='button' bsStyle='primary' onClick={() => {fields.remove(index)}}>
                <Glyphicon glyph='minus' />
              </Button>
            }
          </Col>
        </Row>
        <br/>
      </div>
    )}
  </div>
)

const renderMethods = ({ fields }) => (
  <div>
    {!fields.length ?
      <Row>
        <Col sm={2}><ControlLabel>Methods</ControlLabel></Col>
        <Col sm={5}>
          <Button type='button' bsStyle='primary' onClick={() => {fields.push()}}>
              <Glyphicon glyph='plus' />Add HTTP method
          </Button>
        </Col>
      </Row>
      : ''
    }
    {fields.map((fld,index) =>
      <Row key={'method'+index}>
        <Col componentClass={ControlLabel} sm={2}>
          {' '}{(index==0 ? ' Methods' : '')}
        </Col>
        <Col sm={4}>
        <Field name={fld} type="text" component="input" placeholder="HTTP method"/>
        </Col>
        <Col sm={1}>
          {index==0 ?
            <Button type='button' bsStyle='primary' onClick={() => {fields.push();}}>
              <Glyphicon glyph='plus' />
            </Button>
            :
            <Button type='button' bsStyle='primary' onClick={() => {fields.remove(index)}}>
              <Glyphicon glyph='minus' />
            </Button>
          }
        </Col>
        <Col sm={5}/>
      </Row>
    )}
  </div>
)


export default reduxForm(
  {
    form: 'moduleForm'
  }
)(ModuleForm);

