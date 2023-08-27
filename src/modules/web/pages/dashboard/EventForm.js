import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { withTranslation } from 'react-i18next';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import itLocale from "date-fns/locale/it";
//import moment from "moment";
//import MomentUtils from "@date-io/moment";

import uuidV4 from 'uuid/v4'
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from '@material-ui/pickers';

import ServicesField from '../../../../components/fields/ServicesField'
import UsersField from '../../../../components/fields/UsersField'
import {
  GetServices
} from "../../../../helpers/db";
import moment from 'moment'
import _ from 'lodash'

import {
  UpdateUsers
} from "../../../../helpers/db";

export class EventForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      services: [],
      showUserForm: false
    }
  }

  componentDidMount() {
    this.getServices();
  }

  getServices() {
    let newServices = []
    GetServices(true).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newServices.push(data);
      });
      this.setState({
        services: newServices,
      })
    })
  }


  handleSubmit = e => {
    e.preventDefault();
    if(!this.state.event.refUserId && this.state.event.refServiceId) {
      this.saveUser(this.state.event.user).then( (user) => {
        this.setState({
          showUserForm: !this.state.showUserForm,
          event: {...this.state.event, 
            refUserId: user.id,
            user: user
          }
        }, () => {
          this.props.onSaveEvent(this.state.event);
          this.state.onRequestClose()
        })
        }
      );
    } else {
      this.state.onRequestClose()
      this.props.onSaveEvent(this.state.event);
    }
  }

  handleDelete = e => {
    e.preventDefault();
    this.state.onRequestClose()
    this.state.onDeleteEvent(this.state.event)
  }
  handleCancel = e => {
    e.preventDefault();
    this.state.onRequestClose()
  }

  handleStartDateChange = e => {
    const services = this.getSelectedServices();
    const totalDurationMinutes = this.getEndTimeFromServices(services);
    const startTime = e;
    const endTime = new Date(moment(startTime).add(totalDurationMinutes, 'minutes'));
    this.setState({event: {...this.state.event, start: startTime, end: endTime}});
  }

  getSelectedServices() {
    return _.filter(this.state.services, (service) => { return this.state.event.refServiceId && this.state.event.refServiceId.includes(service.id) });
  }

  handleEndDateChange = e => {
    let event = this.state.event;
    event.end = e;
    this.setState({
      event: event
    })
  }

  getEndTimeFromServices(services) {
    return _.reduce(services, (result, value) => {
      return result + value.duration;
    },0)
  }

  onServiceChange = (items) => {
    const ids = items.map( (item) => { return item.id} );
    const totalDurationMinutes = this.getEndTimeFromServices(items);
    const startTime = this.state.event.start;
    const endTime = new Date(moment(startTime).add(totalDurationMinutes, 'minutes'));
    this.setState({event: {...this.state.event, refServiceId: ids, end: endTime}});
  }

  toggleUserForm = () =>{
    this.setState({
      showUserForm: !this.state.showUserForm
    })
  }

  saveUser = (user) => {
    user.id = user.id ? user.id : uuidV4();
    return UpdateUsers(user.id).set(user).then( () =>
      { return user }
    ).catch(error => {
      console.error('Update Event error', error);
    });
  }  

  render() {
    const { t } = this.props;
    const { event, services } = this.state;
    return (
      <div>
      {
        (services.length > 0 ) &&
        <form
          onSubmit={e => this.handleSubmit(e)}
        >
          <RaisedButton
            className={this.props.event.title ? '' : 'd-none'}
            label="Delete"
            type="button"
            secondary={true}
            onClick={this.handleDelete}
          />
          <div>
          <br/>
            <UsersField
              uid={this.props.uid}
              defaultValue={event.refUserId}
              onChange={(newValue) => this.setState({event: {...this.state.event, refUserId: newValue}})}
            />
            {
              (!this.state.showUserForm) &&
              <button onClick={this.toggleUserForm}>Nuovo Utente</button>
            }
            {
              (this.state.showUserForm) &&
              <div>
                <TextField
                  id="name"
                  floatingLabelText={t("UserName")}
                  onChange={(e) => this.setState({event: {...this.state.event, user: {...this.state.event.user, name: e.target.value }}})}
                />
                <TextField
                  id="surname"
                  floatingLabelText={t("LastName")}
                  onChange={(e) => this.setState({event: {...this.state.event, user: {...this.state.event.user, lastname: e.target.value }}})}
                />
                <TextField
                  id="phone"
                  floatingLabelText={t("Phone")}
                  onChange={(e) => this.setState({event: {...this.state.event, user: {...this.state.event.user, phone: e.target.value }}})}
                />
              </div>
            }
            <ServicesField
              uid={this.props.uid}
              services={services}
              defaultValue={event.refServiceId}
              onChange={this.onServiceChange}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={itLocale}>
              <DateTimePicker
                autoOk
                ampm={false}
                format="dd/MM/yyyy"
                value={event.start}
                onChange={this.handleStartDateChange}
                label={t("Day")}
              />
              <br/>
              <KeyboardTimePicker
                ampm={false}
                variant="inline"
                label={t("StartHour")}
                value={event.start}
                onChange={this.handleStartDateChange}
              />
              <KeyboardTimePicker
                ampm={false}
                variant="inline"
                label={t("EndHour")}
                value={event.end}
                onChange={this.handleEndDateChange}
              />
            </MuiPickersUtilsProvider>
            <TextField
              defaultValue={event.notes}
              floatingLabelText={t("Notes")}
              onChange={(event, newValue) => this.setState({event: {...this.state.event, notes: newValue}})}
            />
            {'phone' in event ? <TextField
              defaultValue={event.phone}
              floatingLabelText="Phone"
              onChange={(event, newValue) => this.setState({event: {...this.state.event, phone: newValue}})}
            /> : ''}

          </div>
          <div>
            <RaisedButton
              className={event.title ? ' mr-3 my-3' : 'd-none mr-3 my-3'}
              label="Update"
              primary={true}
              type="submit"
            />
            <RaisedButton
              className={event.title ? 'd-none mr-3 my-3' : 'mr-3 my-3'}
              label="Create"
              primary={true}
              type="submit"
            />
            <RaisedButton
              className={'mr-3 my-3'}
              label="Cancel"
              type="Cancel"
              onClick={this.handleCancel}
            />

          </div>

        </form>
      }
      </div>
    );
  }
}

export default withTranslation()(EventForm);