import React, { Component } from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import Calendar from './Calendar'

class Dashboard extends Component {

  render() {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
          <div><strong>{context.email} {context.sid}</strong></div>
                <Calendar uid={context.uid} sid={context.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
  }

}

export default (Dashboard);
