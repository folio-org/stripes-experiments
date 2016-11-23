import React from 'react';
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch';
import Pane from '@folio/stripes-components/lib/Pane';
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Button from '@folio/stripes-components/lib/Button';
import RadioButton from '@folio/stripes-components/lib/RadioButton';
import Select from '@folio/stripes-components/lib/Select'
import TextField from '@folio/stripes-components/lib/TextField'

class FilterPane extends React.Component{
  constructor(props){
    super(props);
    this.state={
      patronFilter: true,
      employeeFilter: false,
      searchTerm: ''
    };
  }
  
  updateFilters(e){
    let stateObj = {};
    stateObj[e.target.id] = !this.state[e.target.id];
    this.setState(stateObj);
  }
  
  updateSearchTerm(e){
    let term = e.target.value;
    this.setState({searchTerm:term});
  }
  
  render(){
    return(
      <Pane 
        defaultWidth="16%" 
        header={
          <FilterPaneSearch 
            id="SearchField" 
            
          />
        }
      >
        <FilterControlGroup label="Filters">
          <Checkbox id="patronFilter" label="Patrons" noSpacer hover fullWidth />
          <Checkbox id="employeeFilter" label="Employees" noSpacer hover fullWidth />
          <Checkbox id="uncontrolledFilter" label="Uncontrolled" noSpacer hover fullWidth />
        </FilterControlGroup>
        <FilterControlGroup label="Actions">
          <Button fullWidth>Add User</Button>
        </FilterControlGroup>
      </Pane>
    );
  }
}

export default FilterPane;
