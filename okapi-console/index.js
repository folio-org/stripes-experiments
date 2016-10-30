import React from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import ConsoleMenu from './ConsoleMenu'
import TenantList from './tenants/TenantList';
import TenantAdd from './tenants/TenantAdd';
import TenantEdit from './tenants/TenantEdit';
import ModuleList from './modules/ModuleList';
import ModuleAdd from './modules/ModuleAdd';
import ModuleEdit from './modules/ModuleEdit';
import Health from './health/Health.js';
import HealthConnected from './health/HealthConnected.js';


export default ({pathname}) => <div>
  <Match exactly pattern={pathname} component={ConsoleMenu}/>
  <Match exactly pattern={`${pathname}/tenants`} component={TenantList}/>
  <Match pattern={`${pathname}/tenants/edit/:tenantid`} component={TenantEdit}/> 
  <Match pattern={`${pathname}/tenants/add`} component={TenantAdd}/>
  <Match exactly pattern={`${pathname}/modules`} component={ModuleList}/>
  <Match pattern={`${pathname}/modules/edit/:moduleid`} component={ModuleEdit}/> 
  <Match pattern={`${pathname}/modules/add`} component={ModuleAdd}/>
  <Match exactly pattern={`${pathname}/health/health`} component={Health}/>
  <Match exactly pattern={`${pathname}/health/healthconnected`} component={HealthConnected}/>
</div>;
