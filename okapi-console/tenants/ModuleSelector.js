import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Grid, Row, Col } from 'react-bootstrap';

class ModuleSelector extends Component {

  static manifest = {
    'enabledmodules': { type: 'okapi',
                        path: '_/proxy/tenants/:tenantid/modules',
                        clientGeneratePk: false
                      },
    'modules' :       { type: 'okapi',
                        path: '_/proxy/modules' }
  };

  enableModule(moduleId) {
    let data = {
      id: moduleId
    };
    this.props.mutator['enabledmodules'].create(data);
  }

  disableModule(moduleId) {
    let data = {
      id: moduleId
    };
    this.props.mutator['enabledmodules'].delete(data);
  }

  render() {
    const { data } = this.props;

    var styles = {
      bold: {
        fontWeight: 'bold'
      },
      normal: {
        fontWeight: 'normal'
      }
    };

    var allModules = data['modules'];
    var enabledModules = data['enabledmodules'];
    var availableModuleNodes = availableModules(allModules,enabledModules).map((amodule, i) => {
      return (
        <li key={amodule.id}><span style={(amodule.enabled ? styles.bold : styles.normal)}>{amodule.name}</span>{' '}{' '}<a key={amodule.id} href='#' 
               onClick={ (e) => {e.preventDefault(); amodule.enabled ? this.disableModule(amodule.id) : this.enableModule(amodule.id);}}>{amodule.enabled ? '[X]' : 'Enable'}</a></li>
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
  }
}

const availableModules = (allModules, enabledModules) => {
      let moduleList = [];
      for (let i=0; i<allModules.length; i++) {
        let amodule = {};
        amodule.name = allModules[i].name;
        amodule.id = allModules[i].id;
        amodule.enabled=false;
        for (let j=0; j<enabledModules.length; j++) {
          if (enabledModules[j].id == amodule.id) {
            amodule.enabled = true;
          } 
        }
        moduleList.push(amodule);
      }
      return moduleList;
};


export default connect(ModuleSelector, 'okapi-console');