import React, { Component } from 'react';
// import context
import { ProfilerConsumer } from '../../../../context/profileContext'
// import components
import UsersManager from './UsersManager'


class Users extends Component {
  render() {
    return (
      <ProfilerConsumer>
        {context => {
          if (context.email) {
            return (
              <div>
                <UsersManager uid={context.uid} sid={context.sid}/>
              </div>
            )
          }
        }}
      </ProfilerConsumer>
    )
  }

}

export default (Users);
