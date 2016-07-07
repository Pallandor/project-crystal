import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './calendarActions';
import moment from 'moment';
import Header from '../App/Header';
import Footer from '../App/Footer';
import BigCalendar from 'react-big-calendar';
import CreateEvent from './CreateEvent';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import find from 'lodash/find';
import merge from 'lodash/merge'; 

class Calendar extends Component {
  constructor(props) {
    super(props);
    // Used to store the state for Material-UI Dialog component and
    // and for the selectEvent prop in BigCalendar
    this.state = {
      open: false,
      eventBox: '',
    };
    // Bind all class functions to the class for use throughout the component
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
  }

  // Populate the calendar with all events for the couple on initial render
  componentDidMount() {
    console.log('did component mountlifecycle...');
    const { fetchEvents, user } = this.props; 
    if (user && user.data) {
      console.log('calendar component did mount, trying to fetch events +++++  ');
      fetchEvents(user.data.couple_id); // misconception across needing .data because he sends response.data instead of .data.data.. fuck
    }
  }

  componentDidMount(){
    /** RF: This involves race conditions, assumes fetchEvents populates props quickly enough... 
    Possibly place in better lifecycle hook.. */
    if (this.props.params.eventId && this.props.events.data) {
      this.setState({
        open: true,
        eventBox: find(this.props.events.data, { event_id: parseInt(this.props.params.eventId) }),
      });
    }
  }


  // Get all events for the couple
  getEvents() {
    // Get all events from state and format them in a way in that can be read by the BigCalendar
    const eventsArr = this.props.events.data;
    for (let i = 0; i < eventsArr.length; i++) {
      let tempStart = eventsArr[i].start_date;
      let tempEnd = eventsArr[i].end_date;
      tempStart = new Date(tempStart);
      tempEnd = new Date(tempEnd);
      eventsArr[i].start = tempStart;
      eventsArr[i].end = tempEnd;
    }
    // This is what gets passed into the events of the BigCalendar component
    return eventsArr;
  }

  // Delete the event that was clicked on then re-render the new updated events
  deleteEvent() {
    this.props.deleteEvent(this.state.eventBox.event_id);
    setTimeout(() => {
      this.props.fetchEvents(this.props.user.data.couple_id);
    }, 350);
  }

  // Change the state to allow Dialog component to open
  handleDialogOpen() {
    this.setState({ open: true });
  }

  // Change the state to allow Dialog component to close
  handleDialogClose() {
    this.setState({ open: false });
  }

  // Formats dates into user friendly format on the event pop-up (click)
  formatDate(time) {
    return moment(time).format('MMMM Do @ h:mmA');
  }

  // on a reload... well a full page reload will just retriger componentDidMount because remounting it entirely. dadaoy. 
  // componentWillReceiveProps(nextProps){
  //   const { fetchEvents, user } = this.props; 
  //    if (this.props.events && this.props.events.data && !isEqual(this.props.events.data.length, nextProps.events.data.length) { //as long as immutable shoudl be ok 
  //     console.log('in componentWillReceiveProps and yep, props is diff so will fetch events! ...');
  //     fetchEvents(user.data.couple_id); // misconception across needing .data because he sends response.data instead of .data.data.. fuck
  //   }
  // }

  render() {
    // If there are no events yet, load a spinner
    if (!this.props.events){
          return (
            <h1> loadingg....... (lol) </h1>
          );
        }
     const actions = [ 
     <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialogClose}
      />,

      <FlatButton
        label="Delete"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => { this.deleteEvent(); this.handleDialogClose(); }}
      />,
    ];
    return (
      <div>
        <div>
          <Dialog
            title="Event Details"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleDialogClose}
          >
            <div className="section">
              Title: {this.state.eventBox.title}
            </div>
            <div className="divider"></div>
            <div className="section">
              Start: {this.formatDate(this.state.eventBox.start)}
              <br />
              End: {this.formatDate(this.state.eventBox.end)}
            </div>
            <div className="divider"></div>
            <div className="section">
              Description: {this.state.eventBox.description}
            </div>
          </Dialog>
        </div>
      {/* Default render: Renders the Header, CreateEvent button, and BigCalendar */}
        <div>
          <Header />
          
          <h1>The url router filter should be: {this.props.params.eventId ? this.props.params.eventId : 'it didnt have anything'}</h1>
        
          <div className="container">
            <CreateEvent />
            <BigCalendar
              selectable
              formats={{ weekHeaderFormat: 'ddd MM DD' }}
              events={this.getEvents()}
              style={{ border: '1px solid #4dd0e1', height: '600px', marginTop: '48px' }}
              onSelectEvent={event => this.setState({ open: true, eventBox: event })}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { events: state.calendar.events, user: state.auth.user };
};

export default connect(mapStateToProps, actions)(Calendar);
