import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Grid, Row, Col } from 'react-bootstrap';

class ModuleSelector extends Component {

  static manifest = {
    '_/proxy/tenants': { type: 'okapi',
                         path: ':tenantid/modules' },
    '_/proxy/modules' : { type: 'okapi' }
  };

  render() {
    var styles = {
      bold: {
        fontWeight: 'bold'
      },
      normal: {
        fontWeight: 'normal'
      }
    };

    if (false) {
      var availableModuleNodes = this.props.availableModules.map((amodule, i) => {
        return (
          <li key={amodule.id}><span style={(amodule.enabled ? styles.bold : styles.normal)}>{amodule.name}</span>{' '}{' '}<a key={amodule.id} href='#' 
                 onClick={ (e) => {e.preventDefault(); amodule.enabled ? disableModule(amodule.id) : enableModule(amodule.id);}}>{amodule.enabled ? '[X]' : 'Enable'}</a></li>
        );
      });

      return (
        <div>
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={6}><h3>Available modules</h3></Col>
            </Row>
            <Row className="show-grid">
              <Col xs={6} md={6}>{availableModuleNodes}</Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return (<div>placeholder</div>);
    }
  }
}

const availableModules = (modules, tenants_modules) => {
      let moduleList = [];
      for (let i=0; i<modules.length; i++) {
        let amodule = {};
        amodule.name = modules[i].name;
        amodule.id = modules[i].id;
        amodule.enabled=false;
        for (let j=0; j<tenants_modules.length; j++) {
          if (tenants_modules[j].id == amodule.id) {
            amodule.enabled = true;
          } 
        }
        moduleList.push(amodule);
      }
      return moduleList;
};

export default connect(ModuleSelector, 'okapi-console');