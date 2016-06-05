import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Menu } from './Menu';

export class App extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row><Menu /></Row>
          <Row>
            <Col id="content">{this.props.children}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
