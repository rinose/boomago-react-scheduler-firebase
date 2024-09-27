import React, { Component } from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
//Actions
import {
  UpdateServices,
  UpdateUsers,
  UpdateEvents
} from "../../../../helpers/db";

class Settings extends Component {

  handleImportServices() {

  }

  handleImportServices=event=>{
    const reader = new FileReader();
    reader.onload = function() {
      const text = reader.result;
      const services = JSON.parse(text);
      services.forEach( (obj) => {
        obj.id = String(obj.id);
        UpdateServices(this.props.sid, obj.id).set(obj).then(function(docRef) {
          console.log("Document written");
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      });
    };
    reader.readAsText(event.target.files[0]);
  }

  handleImportUsers=event=>{
    const reader = new FileReader();
    reader.onload = function() {
      const text = reader.result;
      const items = JSON.parse(text);
      items.forEach(function(obj) {
        obj.id = String(obj.id);
        if(obj.surname) {
          obj.lastname = obj.surname;
        }
        UpdateUsers(obj.id).set(obj).then(function() {
            //console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      });
    };
    reader.readAsText(event.target.files[0]);
  }

  handleImportBookings=event=>{
    const reader = new FileReader();
    reader.onload = function() {
      const text = reader.result;
      const services = JSON.parse(text);
      services.forEach(function(obj) {
        UpdateEvents(String(obj.id)).set(obj).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      });
    };
    reader.readAsText(event.target.files[0]);
  }

  render() {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                Services: 
                <input type="file" name="file" onChange={this.handleImportServices}/><br/>
                Users: 
                <input type="file" name="file" onChange={this.handleImportUsers}/><br/>
                Bookings: 
                <input type="file" name="file" onChange={this.handleImportBookings}/><br/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
  }

}

export default (Settings);
