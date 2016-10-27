import React from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import PatronList from './PatronList';
import PatronAdd from './PatronAdd';
import PatronEdit from './PatronEdit';


export default ({pathname}) => <div>
  <Match exactly pattern={pathname} component={PatronList}/>
  <Match pattern={`${pathname}/edit/:patronid`} component={PatronEdit}/> 
  <Match pattern={`${pathname}/add/:patronid`} component={PatronAdd}/>
</div>;
