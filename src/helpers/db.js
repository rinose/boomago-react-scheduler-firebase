import { db } from '../config/constants';
//import 'firebase/firestore'
//import firebase from 'firebase';
// Required for side-effects
//require('firebase/firestore');
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  console.log(err)
  if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
  } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
  }
});

const sid = localStorage["sid"];
const data = sid ? db.collection(sid).doc("data") : null;

window.services = [];

/*if(data) {
let observer = data.collection('services')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        //console.log('New service: ', change.doc.data());
        window.services.push(change.doc.data());
      }
      if (change.type === 'modified') {
        //console.log('Modified service: ', change.doc.data());
      }
      if (change.type === 'removed') {
        //console.log('Removed service: ', change.doc.data());
      }
      //var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
        //console.log("onSnapshot Data came from " + source);
    });
  });
}*/

// EVENTS
export function GetEvents(dateRange) {
  ///return db.enableNetwork().then( () => {
  const start = dateRange.start;
  const end = dateRange.end;
  //console.log(dateRange)
  return data.collection('events').where('start', '>=',start).where('start', '<=', end).get();
  //});
}
export function UpdateEvents(id) {
  return data.collection('events').doc(id)
}
// SERVICES
export function GetServices(fromCache) {
  //const lastLogin = localStorage["lastlogin"];
  //if(fromCache === true) {
  //  db.disableNetwork();
  //}
  return data.collection('services').orderBy('name', 'asc').get();
}
export function UpdateServices(id) {
  return data.collection('services').doc(id)
}
export function DeleteService(id) {
  return data.collection('services').doc(id).delete();
}
// USERS
export function GetUsers(fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return data.collection('users').orderBy('lastname', 'asc').get();
}
export function GetUserByEmail(email) {
  return data.collection('users').where('email', '==', email).get();
}
export function UpdateUsers(id) {
  return data.collection('users').doc(id)
}
export function DeleteUser(id) {
  return data.collection('users').doc(id).delete();
}
// RESOURCES
export function GetResources(fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return data.collection('resources').orderBy('name', 'asc').get();
}
export function UpdateResources(id) {
  return data.collection('resources').doc(id)
}
export function DeleteResource(id) {
  return data.collection('resources').doc(id).delete();
}