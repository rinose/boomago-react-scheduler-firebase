// import libs
import React, { useState, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import { createBrowserHistory } from 'history';
// import services actions
import { firebaseAuth } from '../config/constants';
// import context
import { ProfileProvider } from '../context/profileContext'
// import components
import routes from './routes'
import PrivateRoute from './Private'
import PublicRoute from './Public'
import { LocalStorage } from '../helpers/utils'

import {
  GetUserByEmail,
  addNewUser
} from "../helpers/db";

import { withTranslation } from 'react-i18next';

const history = createBrowserHistory();


const Router = (props) => {
  const _routes = routes.map((route, i) => {
    if (route.auth && props.user /*&& props.route.roles.includes(props.state.user.role)*/ ) {
      return {
        ...route,
        element: <PrivateRoute user={props.user} key={i} {...route} />
      }
    }
    return {
      ...route,
      element: <PublicRoute user={props.user} routeAuth={route.auth} key={i} {...route} />
    }
  })
  let element = useRoutes(_routes);
  return element;
};

function MyRoutes () {

    const [user, setUser] = useState({});


    /*if(sid) localStorage.setItem("sid", sid);
    super(props);
    this.state = {
      authed: !!localStorage[storageKey],
      user: {
        sid: localStorage["sid"],
        email: null,
        uid: null,
      }
    };*/

    useEffect(() => {
      firebaseAuth().onAuthStateChanged(user => {
        if (user) {
          localStorage.setItem("lastlogin", String(new Date().getTime()))
          console.log(user)
          console.log(user.email)
          GetUserByEmail(user.email)
          .then( querySnapshot => {
            //let role = "superadmin"
            //let sid = ""
            console.log(querySnapshot)

            if (querySnapshot.empty) {
              // Add new user
              const newUser = {
                email: user.email,
                id: user.email,
                structures: []
              }
              LocalStorage.setCurrentStructureId(null);
              addNewUser(newUser).then(setUser(newUser)
              ).catch( error => {
                console.error("Error adding document: ", error);
              });
              console.log("No such document!");
              return;
            }

            let data = {}
            querySnapshot.forEach(doc => {
              const _data = doc.data();
              data = _data;
            });
            setUser(data);
    
            /*this.setState({
              authed: true,
              user: data,
              user: {
                sid: sid,
                email: user.email,
                uid: user.uid,
                role: role
              },
            });*/
          }).catch( error => {
            console.log("Error getting documents: ", error);
          });
        } else {
          setUser({ email: null, uid: null });
        }
      });
    }, []);



  //if(this.state.user.sid && !this.state.user.role) return <div></div>;
  return <ProfileProvider value={user}>
    <BrowserRouter hisotry={history} basename="/">
      <Router user={user}/>
    </BrowserRouter>
  </ProfileProvider>

}


export default withTranslation()(MyRoutes);