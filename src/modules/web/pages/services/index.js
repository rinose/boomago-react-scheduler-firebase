import React from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import ServicesManager from './ServicesManager'

function Services (props) {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <ServicesManager uid={context.uid} sid={props.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
}

export default (Services);
