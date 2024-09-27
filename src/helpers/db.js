import { db, FieldPath } from '../config/constants';


//import 'firebase/firestore'
//import firebase from 'firebase';
// Required for side-effects
//require('firebase/firestore');


//const sid = localStorage["sid"];
//const data = sid ? db.collection(sid).doc("data") : null;

window.services = [];


export function AddStructure(data) {
  data.modified = new Date();
  data.created = new Date()
  return db
    .collection(`structures`)
    .add(data)
    .then(docRef => docRef)
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
}


export function SaveStructure(data) {
  data.modified = new Date();
  return db
    .collection(`structures`)
    .doc(data.id)
    .set(data, { merge: true })
    .then(docRef => docRef)
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
}

export function GetStructures(ids) {
  return db.collection("structures").where(FieldPath.documentId(), 'in', ids).get();
}


export function SetUserStructures(structures, user_id) {
  console.log("SetUserStructures")
  console.log(structures, user_id)
  return db.collection("users").doc(user_id).set({
    structures: structures,
  }, { merge: true })
  .then(docRef => docRef)
  .catch(function (error) {
    console.error('Error adding structure to user: ', error)
  })
}


export function saveUser(user) {
  return db
    .collection(`users`)
    .doc(user.uid)
    .set({
      email: user.email,
      uid: user.uid
    }, { merge: true })
    .then(docRef => docRef)
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
}


// EVENTS
export function GetEvents(sid, dateRange) {
  ///return db.enableNetwork().then( () => {
  const start = dateRange.start;
  const end = dateRange.end;

  return db.collection("structures").doc(sid).collection('events').where('start', '>=',start).where('start', '<=', end).get();
  //});
}
export function UpdateEvents(sid, id) {
  return db.collection("structures").doc(sid).collection('events').doc(id)
}
// SERVICES
export function GetServices(sid, fromCache) {
  //const lastLogin = localStorage["lastlogin"];
  //if(fromCache === true) {
  //  db.disableNetwork();
  //}
  return db.collection("structures").doc(sid).collection('services').orderBy('name', 'asc').get();
}
export function UpdateServices(sid, id) {
  return db.collection("structures").doc(sid).collection('services').doc(id)
}
export function DeleteService(sid, id) {
  return db.collection("structures").doc(sid).collection('services').doc(id).delete();
}
// USERS
export function GetUsers(sid, fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return db.collection("structures").doc(sid).collection('users').orderBy('lastname', 'asc').get();
}


export function GetUserByEmail(email) {
  return db.collection('users').where('email', '==', email).get();
}


export function addNewUser(user) {
  return db.collection('users').doc(user.id).set(user);
}

export function UpdateUsers(sid, id) {
  return db.collection("structures").doc(sid).collection('users').doc(id)
}
export function DeleteUser(sid, id) {
  return db.collection("structures").doc(sid).collection('users').doc(id).delete();
}


// RESOURCES
export function GetResources(sid, fromCache) {
  if(fromCache === true) {
    //db.disableNetwork();
  }
  return db.collection("structures").doc(sid).collection('resources').orderBy('name', 'asc').get();
}
export function UpdateResources(sid, id) {
  return db.collection("structures").doc(sid).collection('resources').doc(id)
}
export function DeleteResource(sid, id) {
  return db.collection("structures").doc(sid).collection('resources').doc(id).delete();
}

export function mv() {
  var collRefSource = db.collection('beautycentervenus').doc('data').collection('users');
  var collRefDest = db.collection('structures').doc('beautycentervenus').collection('users');
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