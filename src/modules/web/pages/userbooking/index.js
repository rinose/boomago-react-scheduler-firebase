import React, {useState, useEffect, useCallback} from 'react'
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
import BookingManager from './BookingManager'
//Actions
import {
  GetServices
} from "../../../../helpers/db";

export default function UserBooking(props) {

  const [services, setServices] = useState([])

  const getServices = useCallback(() => {
    console.log("getServices")
    let newServices = [];
    GetServices(props.sid, true).then(querySnapshot => {
      var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
      console.log("Data came from " + source);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newServices.push(data);
      });
      setServices(newServices)
    })
  }, [props.sid]); 



  useEffect(() => {
    getServices();
  }, [getServices]);




  return (
    <ProfilerConsumer>
      {context => {
        if (context.email) {
          return (
            <BookingManager services={services}/>
          )
        }
      }}
    </ProfilerConsumer>
  )
}
