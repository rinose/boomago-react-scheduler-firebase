import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { withTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { LocalStorage } from '../../../../helpers/utils';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import ServicesField from '../../../../components/fields/ServicesField'
import UsersField from '../../../../components/fields/UsersField'
import {
  GetServices
} from "../../../../helpers/db";

import moment from 'moment'
import _ from 'lodash'

export function EventForm ( props ) {
  const [services, setServices] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [endTime, setEndTime] = useState(props.event.end);
  const [togglePhone, setTogglePhone] = useState(props.event.sendsms);
  const [user, setUser] = useState(props.event.user);
  const [phone, setPhone] = useState(props.event && props.event.user && props.event.user.phone ? props.event.user.phone : null);

  useEffect(() => {
    const getServices = () => {
      let newServices = []
      GetServices( LocalStorage.getCurrentStructureId(), true).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          newServices.push(data);
        });
        setServices(newServices)
      })
    }
    getServices();
  }, []);


  const handleStartDateChange = (e) => {
    const services = getSelectedServices();
    const totalDurationMinutes = getEndTimeFromServices(services);
    const startTime = e;
    const endTime = new Date(moment(startTime).add(totalDurationMinutes, 'minutes'));
    props.event.start = e;
    props.event.end = endTime;
    setEndTime(endTime);
  }

  const getSelectedServices = () => {
    return _.filter(services, (service) => { return props.event.refServiceId && props.event.refServiceId.includes(service.id) });
  }

  const handleEndDateChange = e => {
    props.event.end = e;
  }

  const getEndTimeFromServices = (services) => {
    return _.reduce(services, (result, value) => {
      return result + value.duration;
    },0)
  }

  const onServiceChange = (items) => {
    const ids = items.map( (item) => { return item.id} );
    const totalDurationMinutes = getEndTimeFromServices(items);
    const startTime = props.event.start;
    const endTime = new Date(moment(startTime).add(totalDurationMinutes, 'minutes'));
    props.event.refServiceId = ids;
    props.event.end = endTime;
    setEndTime(endTime);
  }

  const toggleUserForm = () =>{
    setShowUserForm(!showUserForm)
  }

  const handleTogglePhone = (checked) => {
    setTogglePhone(checked);
    props.event.sendsms = checked;
  }

  const handleUserChange = (user) => {
    props.event.refUserId = user ? event.refUserId = user.id : null;
    props.event.user = user;
    if (!user) return;
    setUser(user);
    setPhone(user.phone);
  }


  const { event, t } = props;

  return (
    <div>
    {
      (services.length > 0 ) &&
      <form
      >
        <div>
        <br/>
          <UsersField
            sid={props.uid}
            uid={props.uid}
            defaultValue={event.refUserId}
            onChange={handleUserChange}
          />
          {
            (!showUserForm) &&
            <Button onClick={toggleUserForm}>Nuovo Utente</Button>
          }
          {
            (showUserForm) &&
            <div>
              <TextField
                id="name"
                label={t("UserName")}
                onChange={(e) => { event.user.name = e.target.value }}
              />
              <TextField
                id="surname"
                label={t("LastName")}
                onChange={(e) => event.user.lastname = e.target.value }
              />
              <TextField
                id="phone"
                label={t("Phone")}
                onChange={(e) => {
                  event.user.phone = e.target.value;
                  setPhone(e.target.value);
                }}
              />
            </div>
          }
          <ServicesField
            uid={props.uid}
            services={services}
            defaultValue={event.refServiceId}
            onChange={onServiceChange}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={0.01}>
              <DatePicker label={t("Day")} value={event.start} onChange={handleStartDateChange} />
              <br/>
              <MobileTimePicker ampm={false} label={t("StartHour")} defaultValue={event.start} onChange={handleStartDateChange}/>
              <br/>
              <MobileTimePicker ampm={false} label={t("EndHour")} defaultValue={event.end} value={endTime} onChange={handleEndDateChange}/>
            </Stack>
          </LocalizationProvider>

          <TextField
            defaultValue={event.notes}
            label={t("Notes")}
            onChange={(e) => event.notes = e.target.value }
          />
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked={togglePhone} onChange={(e) => handleTogglePhone(e.target.checked)}/>} label="Invio SMS promemoria" />
            <TextField
            type="number"
            disabled={!togglePhone}
            label="Numero di telefono per SMS"
            value={phone ? phone : ""}
            onChange={(event) => {
              user.phone = event.target.value;
              setPhone(event.target.value);
            }}
          />
          </FormGroup>
        </div>
      </form>
    }
    </div>
  );
}

export default withTranslation()(EventForm);