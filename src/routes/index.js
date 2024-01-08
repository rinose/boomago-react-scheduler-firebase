// import libs
import React, { Component } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import { createBrowserHistory } from 'history';
// import services actions
import { firebaseAuth, storageKey } from '../config/constants';
// import context
import { ProfileProvider } from '../context/profileContext'
// import components
import routes from './routes'
import PrivateRoute from './Private'
import PublicRoute from './Public'

import {
  GetUserByEmail
} from "../helpers/db";
import Layout from '../layout'
import { withTranslation } from 'react-i18next';

const history = createBrowserHistory();

class Routes extends Component {
  constructor(props) {
    const url = new URL(window.location.href);
    const sid = url.searchParams.get("sid");
    if(sid) localStorage.setItem("sid", sid);
    super(props);
    this.state = {
      authed: !!localStorage[storageKey],
      user: {
        sid: localStorage["sid"],
        email: null,
        uid: null,
      }
    };
  }


  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      //console.log("onAuthStateChanged")
      //console.log(user)
      if (user) {
        localStorage.setItem("lastlogin", String(new Date().getTime()))
        GetUserByEmail(user.email)
        .then( querySnapshot => {
          let role = "user"
          let sid = ""
          querySnapshot.forEach(doc => {
            const data = doc.data();
            role = data.role;
            sid = data.admins[0].id
          });
          console.log("SID " + sid)
          this.setState({
            authed: true,
            user: {
              sid: sid,
              email: user.email,
              uid: user.uid,
              role: role
            },
          });
        })
      } else {
        this.setState({
          authed: false,
          user: {
            email: null,
            uid: null,
          }
        });
      }
    });
  }

  componentWillUnmount() {
    if(!this.removeListener) return;
    this.removeListener();
  }
  // <Router hisotry={history} basename="/boomago/v2">
  render() {
    //if(this.state.user.sid && !this.state.user.role) return <div></div>;
    return <ProfileProvider value={this.state.user}>
      
      <Router hisotry={history} basename="/">
        <Layout authed={this.state.authed} role={this.state.user.role}>
          <Switch>
            {routes.map((route, i) => {
              if (route.auth && this.state.user.sid && route.roles.includes(this.state.user.role) ) {
                return <PrivateRoute sid={this.state.user.sid} authed={this.state.authed} key={i} {...route} />
              }
              return <PublicRoute sid={this.state.user.sid} routeAuth={route.auth} authed={this.state.authed} key={i} {...route} />
            })}
          </Switch>
        </Layout>
      </Router>
    </ProfileProvider>

  }
}

export default withTranslation()(Routes);
