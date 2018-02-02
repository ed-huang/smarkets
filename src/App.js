import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

let sportButtons = ['horse-racing', 'football', 'tennis', 'basketball', 'golf', 'volleyball', 'boxing', 'cricket'];

export default class DrawerSimpleExample extends React.Component {
  componentDidMount() {
    sportButtons.forEach((nav) => {
      fetch(`http://0.0.0.0:8080/https://smarkets.com/v0/listings/slug/sport/${nav}/?period=upcoming`)
        .then((res) => res.json())
        .then((response) => {
            let category = [];
            let key = nav;
            let object = {};
            for (var event in response.events) {
              if (response.events.hasOwnProperty(event)) category.push(response.events[event]);
            }
            object[`${key}Events`] = category;
            this.setState(object);
        })
    });
    fetch('http://0.0.0.0:8080/https://fe-api.smarkets.com/v0/events/popular/')
      .then((res) => res.json())
      .then((response) => {
          let popularEvents = response.results;
          this.setState({popularEvents});
      })

  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentEvent: null,
      currentCategory: null,
      popularEvents: null,
      horseRacingEvents: null
    };
  }

  eventsToggle = (event) => {
    let events = `${event}Events`;
    this.setState({
      currentCategory: events,
      open: !this.state.open
    });
  }

  handleClose = () => this.setState({open: false});

  handleMenuItemClick = (currentEvent) => {
    this.setState({currentEvent})
  }

  render() {
    const { currentEvent } = this.state;
    return (
      <MuiThemeProvider>
        <div>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              label="Popular"
              open={this.state.open}
              onClick={this.eventsToggle.bind(this, "popular")}
            />
            {sportButtons.map((event, index) => (
              <RaisedButton
                key={index}
                label={event}
                open={this.state.open}
                onClick={this.eventsToggle.bind(this, event)}
              />
            ))}
          </ToolbarGroup>
        </Toolbar>
        <div style={{margin:40}}>
          <h1>{currentEvent ? currentEvent.name : (<p>Please select an event</p>)}</h1>
          <hr></hr>
          {currentEvent ? (
            <ul>
              <li>Name: {currentEvent.name}</li>
              <li>Expires: {currentEvent.expires}</li>
              <li>Leauge: {currentEvent.parent_name}</li>
              <li>Description: {currentEvent.description}</li>
            </ul>
          ) : (<div></div>)}
        </div>
          <Drawer
            docked={false}
            openSecondary={true}
            open={this.state.open}
            width={350}
            onRequestChange={(open) => this.setState({open})}>
            {this.state[this.state.currentCategory] ? (this.state[this.state.currentCategory].map((event) => (
              <MenuItem
                onClick={this.handleMenuItemClick.bind(this, event)}
                key={event.id}>{event.name}</MenuItem>
            ))) : (<div>Loading...</div>)}
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}
