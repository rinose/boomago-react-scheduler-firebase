import React, { Component, Children, cloneElement  } from 'react'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'

import { v4 as uuidv4 } from 'uuid';
import { minTime, maxTime } from '../../../../config/constants'
//Compoments
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddBox';
import EventForm from './EventForm'
import _ from 'lodash'
//Actions
import {
  GetUsers,
  GetServices,
  GetEvents,
  UpdateEvents,
  UpdateServices
} from "../../../../helpers/db";
//Styles


import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
//moment.locale('it')
const localizer = momentLocalizer(moment);



const DragAndDropCalendar = withDragAndDrop(BigCalendar, { backend: false })

function Event({ event }) {
  var servicesList = [];
  if(event.services) {
    servicesList = event.services.map( (item) => {
      return(
        <span key={item.id}>, {item.name}</span>
      )
    });
  }
  var style = {};
  var notes = ""
  if (event.notes && event.type === 'note') {
    style = {
      color: `yellow`
    }
    notes = event.notes.charAt(0).toUpperCase() + event.notes.slice(1);
  } else if (event.notes) {
    notes = "(" + event.notes + ")";
  }
  return (
    <span style={style}>
      <strong>{event.title}</strong>
      {servicesList} 
      {notes}
    </span>
  )
}

const TouchCellWrapper = ({ children, value, onSelectSlot }) =>
  cloneElement(Children.only(children), {
    onTouchEnd: () => onSelectSlot({ action: "click", slots: [value] }),
    style: {
      className: `${children}`
    }
  });


class Dnd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      events: [

      ],
      userFormOpened: false,
      modal: {
        id: null,
        title: null,
        desc: null,
        user: {},
        start: new Date(2018, 4, 4, 7, 0, 0),
        end: new Date(2018, 4, 4, 8, 0, 0),
      }
    }
    this.currentRange = {
      start: new Date(moment().add(-7, "days")),
      end: new Date(moment().add(7, "days"))
    }

    this.currentCalendarView = "day";

    this.moveEvent = this.moveEvent.bind(this);
    this.services = [];
    this.users = [];
  }

  componentDidMount() {
    this.getUsers();
    this.getServices();
  }

  getUsers() {
    this.users = []
    GetUsers(true).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.users.push(doc.data())
      });
      this.updateCalendar();
    })
  }

  getServices() {
    this.services = []
    GetServices(true).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.services.push(doc.data())
      });
      this.updateCalendar();
    })
  }

  updateCalendar() {
    if(this.users.length > 0 && this.services.length > 0) {
      this.getEvents();
    }
  }

  onCalendarViewChange = (viewType) => {
    this.currentCalendarView = viewType;
  }

  onRangeChange = (dates) => {
    if(!_.isArray(dates) && _.isUndefined(dates.start)) {
      return;
    }
    /*if(!_.isArray(dates) && _.isUndefined(dates.start)) {
      const start = new Date(dates);
      start.setHours(0);
      start.setMinutes(0);
      const end = new Date(dates);
      end.setHours(23);
      end.setMinutes(59);
      dates = {
        start: start,
        end: end
      }
    } else*/ 
    if(_.isArray(dates)) {
      const end = new Date(dates[dates.length - 1]);
      end.setHours(23);
      end.setMinutes(59);
      if(dates.length === 1) {
        dates.push(end)
      } else {
        dates[dates.length - 1] = end;
      }
    } else {
      dates.start.setHours(0);
      dates.start.setMinutes(0);
      dates.start.setSeconds(0);
      dates.end.setHours(0);
      dates.end.setMinutes(0);
      dates.end.setSeconds(0);
    }
    this.currentRange = _.isArray(dates) ? {start: dates[0], end: dates[dates.length - 1]} : dates;
    this.getEvents();
  }

  AgendaEvent = ( { event } ) => {
    var servicesList = [];
    if(event.services) {
      servicesList = event.services.map( (item) => {
        return(
          <span key={item.id}>, {item.name}</span>
        )
      });
    }
  
    var style = {width:"100%", cursor: "pointer"};
    var notes = ""
    if (event.type === 'note' && event.notes) {
      style.color= `orange`;
      notes = event.notes.charAt(0).toUpperCase() + event.notes.slice(1);
    } else if (event.notes) {
      notes = "(" + event.notes + ")";
    }

    return (
      <div >
        <div style={style} onClick={ () => { this.selectEvent(event)}}>
        <strong>{event.title}</strong>
        {servicesList}
        {notes}
        </div>
        { false && <Button startIcon={<AddIcon />} size="small" onClick={ () => { this.onSelectSlot({start: event.end, end: event.end})} }>Nuovo appuntamento</Button>}
      </div>
    )
  }

  getEvents() {
    const newEvents = [];
    GetEvents(this.currentRange).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var data = doc.data();
        const user = this.users.find( (item) => { return item.id === data.refUserId } );
        const services = data.refServiceId ? this.services.filter( (item) => { return data.refServiceId.includes(item.id)} ) : null;
        data.title = "Utente anonimo";
        data.start = new Date(data.start.seconds*1000);
        data.end = new Date(data.end.seconds*1000);
        if(user) {
          data.title = user.lastname + " " + user.name;
          data.user = user;
        } else if (data.type && data.type === 'note') {
          data.title = "";
        } else {
          data.title = "Utente anonimo";
        }
        data.services = [];
        if(services) {
          data.services = services;
        }
        newEvents.push(data)
      });
      this.setState({
        events: newEvents,
      })
    })
  }

  moveEvent({ event, start, end }) {
    const { events } = this.state
    const idx = events.indexOf(event)
    let updatedEvent = { ...event, start, end }
    const nextEvents = [...events]
    if (idx > -1) {
      nextEvents.splice(idx, 1, updatedEvent)
      UpdateEvents(event.id).update({ start, end }).then(
        this.setState({
          events: nextEvents,
        })
      ).catch(error => {
        console.error('Update error', error);
      });
    }
    else {
      const newEventId = uuidv4()
      updatedEvent = { ...updatedEvent, id: newEventId, ownerId: this.props.uid }
      nextEvents.push(updatedEvent)
      UpdateEvents(newEventId).set(updatedEvent).then(
        this.setState({
          events: nextEvents,
        })
      ).catch(error => {
        console.error('Create New Event error', error);
      });
    }
  }

  selectEvent = (event) => {
    this.handleOpen(event)
  }

  onSelectSlot = ({ start, end }) => {
    start = new Date(moment(start))
    end = new Date(moment(end))
    this.setState({
      eventFormOpened: true,
      modal: {start, end},
    });
  }

  onEventResize = (event) => {
    const { events } = this.state;
    const start = event.start;
    const end = event.end;
    const eventId = event.event.id;
    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === eventId
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    UpdateEvents(eventId).update({ start, end }).then(
      this.setState({
        events: nextEvents,
      })
    ).catch(error => {
      console.error('Update error', error);
    });
  }

  saveEvent = (event) => {
    event.id = event.id ? event.id : uuidv4();
    event.type = !event.refUserId && !event.refServiceId ? "note" : "appointment";
    UpdateEvents(event.id).set(event).then(
      this.getEvents()
    ).catch(error => {
      console.error('Update Event error', error);
    });
  }

  editEquipment = ({ id, title, desc }) => {
    const { services } = this.state

    const nextServices = services.map(existingEquipment => {
      return existingEquipment.id === id
        ? { ...existingEquipment, title, desc }
        : existingEquipment
    })
    UpdateServices(id).update({ title, desc }).then(
      this.setState({
        services: nextServices,
      })
    ).catch(error => {
      console.error('Update Equipment error', error);
    });
  }

  deleteEvent = ({ id }) => {
    const { events } = this.state

    const nextEvents = events.filter(existingEvent => {
      return existingEvent.id !== id
    })

    UpdateEvents(id).delete().then(
      this.setState({
        events: nextEvents,
      })
    ).catch(error => {
      console.error('Delete Event error', error);
    });
  }
  deleteEquipment = ({ id }) => {
    const { services } = this.state

    const nextServices = services.filter(existingEquipment => {
      return existingEquipment.id !== id
    })

    UpdateServices(id).delete().then(
      this.setState({
        services: nextServices,
      })
    ).catch(error => {
      console.error('Delete error', error);
    });
  }

  handleClose = () => {
    this.setState({
      eventFormOpened: false,
      servicesOpen: false,
      peopleOpen: false,
      modal: this.state.modal,
    });
  };
  handleOpen = (event) => {
    console.log(event)
    this.setState({
      eventFormOpened: true,
      modal: event,
    });
  };
  handleServices = (event) => {
    this.setState({
      modal: event ? event : this.state.modal,
      servicesOpen: true
    });
  }

  onUserFormCancel = () => {
    this.setState({userFormOpened: false})
  }

  opeUserForm = () => {
    this.setState({userFormOpened: true})
  }

  render() {
    if (this.state.events) {
      return (
        <div className={''}>
          {
          (this.state.eventFormOpened) &&
          <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.eventFormOpened}
          onClose={this.handleClose}
          >
            <div className="modal-container">
              <EventForm
                event={this.state.modal}
                onUserAdd={this.opeUserForm}
                onRequestClose={this.handleClose}
                onSaveEvent={this.saveEvent}
                onDeleteEvent={this.deleteEvent}
              />
            </div>
          </Modal>
          }
          <DragAndDropCalendar
            popup
            selectable={true}
            localizer={localizer}
            events={this.state.events}
            onEventDrop={this.moveEvent}
            resizable
            onEventResize={this.onEventResize}
            defaultView="day"
            defaultDate={new Date()}
            onSelectEvent={this.selectEvent}
            onSelectSlot={this.onSelectSlot}
            onNavigate={this.onRangeChange}
            onRangeChange={this.onRangeChange}
            onView={this.onCalendarViewChange}
            min={minTime}
            max={maxTime}
            step={10}
            style={{ height: "80vh" }}
            components={{
              event: Event,
              agenda: {
                event: this.AgendaEvent
              },
              dateCellWrapper: (props) => (
                <TouchCellWrapper {...props} onSelectSlot={this.onSelectSlot} />
              )
            }}
          />
                    {
            <div>
              <Button 
              style={ { position: "absolute", bottom: 10 } } 
              startIcon={<AddIcon />} size="large" 
              onClick={ () => { this.onSelectSlot(
                {
                  start: this.currentRange.start.setHours(9),
                  end: this.currentRange.end.setHours(9)
                }
                )} }>Nuovo appuntamento</Button>
            </div>
          }

        </div>
      )
    }

  }
}

export default DragDropContext(HTML5Backend)(Dnd)