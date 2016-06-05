import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap';
import { IndexLink, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { menus } from 'stripes-loader!';

export class Menu extends Component {
  render() {
    var menuLinks = menus.primary.map(function (entry) {
      return (
        <LinkContainer to={entry.path}>
          <NavItem>{entry.name}</NavItem>
        </LinkContainer>
      );
    });
    return (
      <Navbar fixedTop>
        <NavbarBrand>
          <IndexLink to="/">
            FOLIO!
          </IndexLink>
        </NavbarBrand>
        <Navbar.Collapse>
          <Nav navbar>
            {menuLinks}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
