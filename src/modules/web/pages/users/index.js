import React from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import UsersManager from './UsersManager'


function Users(props) {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <UsersManager uid={context.uid} sid={props.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
}

export default (Users);
