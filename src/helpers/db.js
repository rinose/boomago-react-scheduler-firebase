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

//const sid = localStorage["sid"];
//const data = sid ? db.collection(sid).doc("data") : null;

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



export function saveUser(user) {
  return db
    .collection(`users`)
    .doc(user.uid)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(docRef => docRef)
    .catch(function (error) {
      console.error('Error adding document: ', error)
    }, { merge: true })
}


// EVENTS
export function GetEvents(sid, dateRange) {
  ///return db.enableNetwork().then( () => {
  const start = dateRange.start;
  const end = dateRange.end;
  //console.log(dateRange)
  return db.collection(sid).collection('events').where('start', '>=',start).where('start', '<=', end).get();
  //});
}
export function UpdateEvents(sid, id) {
  return db.collection(sid).collection('events').doc(id)
}
// SERVICES
export function GetServices(sid, fromCache) {
  //const lastLogin = localStorage["lastlogin"];
  //if(fromCache === true) {
  //  db.disableNetwork();
  //}
  return db.collection(sid).collection('services').orderBy('name', 'asc').get();
}
export function UpdateServices(sid, id) {
  return db.collection(sid).collection('services').doc(id)
}
export function DeleteService(sid, id) {
  return db.collection(sid).collection('services').doc(id).delete();
}
// USERS
export function GetUsers(sid, fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return db.collection(sid).collection('users').orderBy('lastname', 'asc').get();
}
export function GetUserByEmail(email) {
  return db.collection('users').where('email', '==', email).get();
}
export function UpdateUsers(sid, id) {
  return db.collection(sid).collection('users').doc(id)
}
export function DeleteUser(sid, id) {
  return db.collection(sid).collection('users').doc(id).delete();
}
// RESOURCES
export function GetResources(sid, fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return db.collection(sid).collection('resources').orderBy('name', 'asc').get();
}
export function UpdateResources(sid, id) {
  return db.collection(sid).collection('resources').doc(id)
}
export function DeleteResource(sid, id) {
  return db.collection(sid).collection('resources').doc(id).delete();
}

export function mv() {
  var collRefSource = db.collection('beautycentervenus').doc('data').collection('events');
  var collRefDest = db.collection('structures').doc('beautycentervenus').collection('events');
  const mv = async (collRefSource, collRefDest) => {
    const querySnapshot = await collRefSource.get();
    querySnapshot.forEach(async docSnapshot => {
      (async () => {
        await collRefDest.doc(docSnapshot.id).set(docSnapshot.data());
        //docSnapshot.ref.delete();
      })();
      console.log("finished")
      //const collRefs = await docSnapshot.ref.getCollections();
      //for (const collRef of collRefs)
      //  mv(collRef, collRefDest.doc(docSnapshot.id).collection(collRef.id))
    });
  };
  mv(collRefSource, collRefDest);
};