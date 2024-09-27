import React, { useState, useEffect, Children, cloneElement  } from 'react'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'

import { v4 as uuidv4 } from 'uuid';
import { minTime, maxTime } from '../../../../config/constants'
//Compoments
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddBox';
import EventForm from './EventForm'
import _ from 'lodash'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { LocalStorage } from '../../../../helpers/utils';


//Actions
import {
  GetUsers,
  GetServices,
  GetEvents,
  UpdateEvents,
  UpdateUsers
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


function Dnd(props) {

  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [eventFormOpened, setEventFormOpened] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentRange, setCurrentRange] = useState({
    start: new Date(moment().add(-7, "days")),
    end: new Date(moment().add(7, "days"))
  });



  useEffect(() => {

    const getUsers = () => {
      GetUsers(props.sid, true).then(querySnapshot => {
        let u = []
        querySnapshot.forEach(doc => {
          u.push(doc.data())
        });
        setUsers(u)
      })
    }
  
    const getServices = () => {
  
      GetServices(props.sid, true).then(querySnapshot => {
        let s = []
        querySnapshot.forEach(doc => {
          s.push(doc.data())
        });
        setServices(s)
      })
    }

    getUsers();
    getServices();
  }, [props.sid]); 



  useEffect(() => {

    const getEvents = () => {
      const newEvents = [];
      GetEvents(props.sid, currentRange).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = doc.data();

          const user = users.find( (item) => { return item.id === data.refUserId } );
          const s = data.refServiceId ? services.filter( (item) => { return data.refServiceId.includes(item.id)} ) : null;
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
          if(s) {
            data.services = s;
          }
          newEvents.push(data)
        });
        setEvents(newEvents);
      })
    }

    const updateCalendar = () => {
      if(users.length > 0 && services.length > 0) {
        getEvents();
      }
    }

    updateCalendar();
  }, [users, services, currentRange, props.sid]);


 const onCalendarViewChange = (viewType) => {
  }

  const onRangeChange = (dates) => {
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
    const d = _.isArray(dates) ? {start: dates[0], end: dates[dates.length - 1]} : dates;
    setCurrentRange(d);
  }

  const AgendaEvent = ( { event } ) => {
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
        <div style={style} onClick={ () => { selectEvent(event)}}>
        <strong>{event.title}</strong>
        {servicesList}
        {notes}
        </div>
        { false && <Button startIcon={<AddIcon />} size="small" onClick={ () => { onSelectSlot({start: event.end, end: event.end})} }>Nuovo appuntamento</Button>}
      </div>
    )
  }

  const moveEvent = ({ event, start, end }) => {
    const idx = events.indexOf(event)
    let updatedEvent = { ...event, start, end }
    const nextEvents = [...events]
    if (idx > -1) {
      nextEvents.splice(idx, 1, updatedEvent)
      UpdateEvents(props.sid, event.id).update({ start, end }).then(
        setEvents(nextEvents)
      ).catch(error => {
        console.error('Update error', error);
      });
    }
    else {
      const newEventId = uuidv4()
      updatedEvent = { ...updatedEvent, id: newEventId, ownerId: props.uid }
      nextEvents.push(updatedEvent)
      UpdateEvents(props.sid, newEventId).set(updatedEvent).then(
        setEvents(nextEvents)
      ).catch(error => {
        console.error('Create New Event error', error);
      });
    }
  }

  const selectEvent = (event) => {
    setSelectedEvent(event)
    handleOpen(event)
  }

  const onSelectSlot = ({ start, end }) => {
    start = new Date(moment(start))
    end = new Date(moment(end))
    setSelectedEvent({ start: start, end: end, user: {} })
    setEventFormOpened(true)
  }

  const onEventResize = (event) => {
    const start = event.start;
    const end = event.end;
    const eventId = event.event.id;
    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === eventId
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    UpdateEvents(props.sid, eventId).update({ start, end }).then(
      setEvents(nextEvents)
    ).catch(error => {
      console.error('Update error', error);
    });
  }

  const saveUser = (user) => {
    user.id = user.id ? user.id : uuidv4();
    return UpdateUsers(props.sid, user.id).set(user).then( () =>
      { return user }
    ).catch(error => {
      console.error('Update Event error', error);
    });
  }

  const scheduleSms = (event) => {
    if(event.sendsms && event.user.phone) {
      console.log(props)
      console.log("scheduling sms for: ", event)
      const structure_name = LocalStorage.getCurrentStructure().name;
      const txt_message = "Ciao " + event.user.name + ", " + 
        structure_name + " ti ricorda il tuo appuntamento per il " + 
        moment(event.start).format("DD/MM/YYYY") + 
        " alle " + moment(event.start).format("HH:mm") + "." + 
        " Per disdire chiama il numero " + LocalStorage.getCurrentStructure().phone
      let to = event.user.phone;
      // if to phone number not starts with +39 add it
      if(to && to.length === 10) {
        to = "+39" + to;
      }
      const send_at = event.start;
      console.log("scheduling sms for: ", event)
      console.log("txt_message: ", txt_message)
    }
  }

  const validateEventForm = (event) => {
    if(event.refServiceId && (!event.refUserId || event.refUserId === 0 || event.refUserId === "")) {
      if (!event.user || !event.user.name || !event.user.lastname) {
        alert("Selezionare un utente oppure creare un nuovo utente con nome e cognome.")
        return false;
      }
    }

    if((!selectedEvent.refServiceId || selectedEvent.refServiceId.length === 0) && (!selectedEvent.notes  || selectedEvent.notes === "")) {
      alert("Selezionare almeno un servizio oppure aggiungere una nota.")
      return false;
    }

    if(selectedEvent.sendsms && (!selectedEvent.user.phone || selectedEvent.user.phone === "")) {
      // controlla che ci sia un numero di telefono valido formato solo da numeri
      const regex = /^[0-9]+$/;
      if(!regex.test(selectedEvent.user.phone)) {
        alert("Selezionare un numero di telefono valido per l'invio del promemoria.")
        return false;
      }
      return false;
    }
    return true;
  }


  const saveEvent = () => {
    if(!validateEventForm(selectedEvent)) return;

    if(selectedEvent.refServiceId && (!selectedEvent.refUserId || selectedEvent.refUserId === 0 || selectedEvent.refUserId === "")) {
      console.log("new User found: ", selectedEvent.user)

      saveUser(selectedEvent.user).then( (user) => {
        selectedEvent.refUserId = user.id;
        console.log("new User saved: ", user)
        setUsers([...users, user]);
        saveEvent();
      });
      return;
    }
    console.log("selectedEvent: ", selectedEvent)

    selectedEvent.id = selectedEvent.id ? selectedEvent.id : uuidv4();

    selectedEvent.type = !selectedEvent.refUserId && !selectedEvent.refServiceId ? "note" : "appointment";
    UpdateEvents(props.sid, selectedEvent.id).set(selectedEvent).then( () => {
     /* const nextEvents = events.filter( (item) => { return item.id !== selectedEvent.id } );
      const user = users.find( (item) => { return item.id === selectedEvent.refUserId } );
      const s = selectedEvent.refServiceId ? services.filter( (item) => { return selectedEvent.refServiceId.includes(item.id)} ) : null;
      */
      const s = selectedEvent.refServiceId ? services.filter( (item) => { return selectedEvent.refServiceId.includes(item.id)} ) : null;
      const user = users.find( (item) => { return item.id === selectedEvent.refUserId } );
      if(user) {
        selectedEvent.user = user;
        selectedEvent.title = user.lastname + " " + user.name;
        selectedEvent.services = s;
      }
      let evtIndex = events.findIndex( (item) => selectedEvent.id === item.id );
      if(evtIndex < 0) {
        scheduleSms(selectedEvent)
        setEvents([...events, selectedEvent])
      } else {
        events[evtIndex] = selectedEvent;
      }
      setEventFormOpened(false);
    }).catch(error => {
      console.error('Update Event error', error);
      alert(error)
    });
  }


  const deleteEvent = () => {

    let result = window.confirm("Sei sicuro di voler cancellare l'evento?")
    if(!result){
      return;
    }


    const nextEvents = events.filter(existingEvent => {
      return existingEvent.id !== selectedEvent.id
    })

    UpdateEvents(props.sid, selectedEvent.id).delete().then( () => {
      setEvents(nextEvents);
      setEventFormOpened(false);
    }).catch(error => {
      console.error('Delete Event error', error);
      alert(error)
    });
  }


  const handleClose = () => {
    setEventFormOpened(false)
  };


  const handleOpen = (event) => {
    event.user = event.user ? event.user : {};
    setSelectedEvent(event)
    setEventFormOpened(true)
  };


  if(!events) return null;

  return (
    <div className={''}>
      {
      (eventFormOpened) &&
      <Dialog
        open={eventFormOpened}
        onClose={handleClose}
        /*PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}*/
      >
        <DialogContent>
          <EventForm
              sid={props.sid}
              event={selectedEvent}
              onSaveEvent={saveEvent}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteEvent}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveEvent} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      }
      <DragAndDropCalendar
        popup
        selectable={true}
        localizer={localizer}
        events={events}
        onEventDrop={moveEvent}
        resizable
        onEventResize={onEventResize}
        defaultView="day"
        defaultDate={new Date()}
        onSelectEvent={selectEvent}
        onSelectSlot={onSelectSlot}
        onNavigate={onRangeChange}
        onRangeChange={onRangeChange}
        onView={onCalendarViewChange}
        min={minTime}
        max={maxTime}
        step={10}
        style={{ height: "80vh" }}
        components={{
          event: Event,
          agenda: {
            event: AgendaEvent
          },
          dateCellWrapper: (props) => (
            <TouchCellWrapper {...props} onSelectSlot={onSelectSlot} />
          )
        }}
      />
                {
        <div>
          <Button 
          style={ { position: "absolute", bottom: 10 } } 
          startIcon={<AddIcon />} size="large" 
          onClick={ () => { onSelectSlot(
            {
              start: currentRange.start.setHours(9),
              end: currentRange.end.setHours(9)
            }
            )} }>Nuovo appuntamento</Button>
        </div>
      }

    </div>)
}

export default DragDropContext(HTML5Backend)(Dnd)