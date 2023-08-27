import React, { Component } from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import ServicesManager from './ServicesManager'

class Services extends Component {
  render() {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <ServicesManager uid={context.uid} sid={context.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
  }

}

export default (Services);
