import React, { Component } from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import ResourcesManager from './ResourcesManager'

class Resources extends Component {
  render() {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <ResourcesManager uid={context.uid} sid={context.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
  }

}

export default (Resources);
