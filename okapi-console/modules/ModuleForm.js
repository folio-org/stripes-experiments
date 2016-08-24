import React, { Component, PropTypes } from 'react';
import { Grid, Container, Row, Col, Form, FormGroup, FormControl, ControlLabel, Input, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import {reduxForm} from 'redux-form';
import Deployments from './Deployments';


class ModuleForm extends Component {
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
    disableFields: false
  };

  render() {
    const {
      fields: {id, name, provides, requires, routingEntries},
      handleSubmit, 
      cancelForm, 
      resetForm, 
      submitting,
      submitLabel, 
      disableFields,
      dirty
    } = this.props;

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
              <FormControl type='text' disabled={disableFields} placeholder='Module name' {...name} />
            </Col>
          </Row>
          <br/>
          {!provides.length ?
            <Row key={'new-provides'}>
              <Col sm={2}><ControlLabel>Provides</ControlLabel></Col>
              <Col sm={5}>
                <Button type='button' bsStyle='primary' onClick={() => {provides.addField();}}>
                    <Glyphicon glyph='plus' />Add entry
                </Button>
              </Col>
            </Row>
            : ''
          }
          {provides.map((provision,i) =>
            <Row key={'provides'+i}>
              <Col sm={2}>
                {i==0 ? <ControlLabel>Provides</ControlLabel> : ''}
              </Col>
              <Col sm={5}>
                <FormControl type='text' disabled={disableFields} placeholder='ID' {...(provision.id)} />
              </Col>
              <Col sm={4}>
                <FormControl type='text' disabled={disableFields} placeholder='Version' {...(provision.version)} />
              </Col>
              <Col sm={1}>
                {i==0 ?
                  <Button type='button' bsStyle='primary' onClick={() => {provides.addField();}}>
                    <Glyphicon glyph='plus' />
                  </Button>
                  :
                  <Button type='button' bsStyle='primary' onClick={() => {provides.removeField(i)}}>
                    <Glyphicon glyph='minus' />
                  </Button>
                }
              </Col>
            </Row>
            )
          }
          <br/>
          {!requires.length ?
            <Row key={'new-requires'}>
              <Col sm={2}><ControlLabel>Requires</ControlLabel></Col>
              <Col sm={5}>
                <Button type='button' bsStyle='primary' onClick={() => {requires.addField();}}>
                    <Glyphicon glyph='plus' />Add entry
                </Button>
              </Col>
            </Row>
            : ''
          }
          {requires.map((requirement,i) =>
            <Row key={'requires'+i}>
              <Col sm={2}>
                {i==0 ? <ControlLabel>Requires</ControlLabel> : ''}
              </Col>
              <Col sm={5}>
                <FormControl type='text' disabled={disableFields} placeholder='Required module ID' {...(requirement.id)} />
              </Col>
              <Col sm={4}>
                <FormControl type='text' disabled={disableFields} placeholder='Minimum version required' {...(requirement.version)} />
              </Col>
              <Col sm={1}>
                {i==0 ?
                  <Button type='button' bsStyle='primary' onClick={() => {requires.addField();}}>
                    <Glyphicon glyph='plus' />
                  </Button>
                  :
                  <Button type='button' bsStyle='primary' onClick={() => {requires.removeField(i)}}>
                    <Glyphicon glyph='minus' />
                  </Button>
                }
              </Col>
            </Row>
          )}
          <br/><br/>
          {!routingEntries.length ?
            <Row key={'new-route'}>
              <Col sm={2}><ControlLabel>Routing</ControlLabel></Col>
              <Col sm={5}>
                <Button type='button' bsStyle='primary' onClick={() => {routingEntries.addField();}}>
                    <Glyphicon glyph='plus' />Add entry
                </Button>
              </Col>
            </Row>
            : ''
          }
          {routingEntries.map((entry,i) =>
            <div key={'route'+i}>
              <Row key={i}>
                <Col sm={2}>
                  {i==0 ? <ControlLabel>Routing</ControlLabel> : ''}
                </Col>
                <Col sm={10}>
                  {!entry.methods.length ?
                    <Row>
                      <Col sm={2}><ControlLabel>Methods</ControlLabel></Col>
                      <Col sm={5}>
                        <Button type='button' bsStyle='primary' onClick={() => {entry.methods.addField();}}>
                            <Glyphicon glyph='plus' />Add entry
                        </Button>
                      </Col>
                    </Row>
                    : ''
                  }
                  {entry.methods.map((method,j) =>
                    <Row key={'entry'+j}>
                      <Col componentClass={ControlLabel} sm={2}>
                        {' '}{(j==0 ? ' Methods' : '')}
                      </Col>
                      <Col sm={4}>
                        <FormControl type='text' disabled={disableFields} placeholder='HTTP method' {...method} />
                      </Col>
                      <Col sm={1}>
                        {j==0 ?
                          <Button type='button' bsStyle='primary' onClick={() => {entry.methods.addField();}}>
                            <Glyphicon glyph='plus' />
                          </Button>
                          :
                          <Button type='button' bsStyle='primary' onClick={() => {entry.methods.removeField(j)}}>
                            <Glyphicon glyph='minus' />
                          </Button>
                        }
                      </Col>
                      <Col sm={5}/>
                    </Row>
                  )}
                </Col>
              </Row>
              <br/>
              <Row>
                <Col sm={1}>{' '}</Col>
                <Col sm={10}>
                  <FormControl type='text' disabled={disableFields} placeholder='Request path' {...(entry.path)}  />
                  <FormControl type='text' disabled={disableFields} placeholder='Priority level' {...(entry.level)}/>
                  <FormControl type='text' disabled={disableFields} placeholder='Type' {...(entry.type)} />
                </Col>
                <Col sm={1}>
                  {i==0 ?
                    <Button type='button' bsStyle='primary' onClick={() => {routingEntries.addField();}}>
                      <Glyphicon glyph='plus' />
                    </Button>
                    :
                    <Button type='button' bsStyle='primary' onClick={() => {routingEntries.removeField(i)}}>
                      <Glyphicon glyph='minus' />
                    </Button>
                  }
                </Col>
              </Row>
              <br/>
            </div>
          )}
          <br/><br/>
          <ButtonGroup className='pull-right'>
            <Button type='submit' bsStyle='primary' disabled={submitting||(!disableFields&&!dirty)} onClick={handleSubmit}>{submitLabel} module proxy</Button>
            <Button type='reset' disabled={submitting||disableFields||!dirty} onClick={resetForm}>Reset</Button>
            <Button type='button' disabled={submitting} onClick={cancelForm}>{dirty? 'Cancel' : 'Go back'}</Button>
          </ButtonGroup>
        </Form>
        <br/><br/>
        <Deployments srvcId={id.value} />
      </div>
    );
  }
}

export default reduxForm(
  {
    form: 'moduleForm',
    fields: ['id','name',
             'provides[].id', 'provides[].version',
             'requires[].id', 'requires[].version',
             'routingEntries[].path', 'routingEntries[].level', 'routingEntries[].type',
             'routingEntries[].methods[]' ]
  },
)(ModuleForm);
