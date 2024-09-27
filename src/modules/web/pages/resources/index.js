import React from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import ResourcesManager from './ResourcesManager'

function Resources (props) {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <ResourcesManager uid={context.uid} sid={props.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
}

export default (Resources);
