import React from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import Calendar from './Calendar'

function Dashboard(props) {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
          <div><strong>{context.email} {context.sid}</strong></div>
                <Calendar uid={context.uid} sid={props.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
}

export default (Dashboard);
