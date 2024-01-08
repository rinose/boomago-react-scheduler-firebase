import React, { Component } from 'react';
import firebase from 'firebase/compat/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { login, resetPassword } from '../../../../helpers/auth';
import { saveUser, mv } from '../../../../helpers/db';

//import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';
//import Link from '@material-ui/core/Link';

// FirebaseUI (for login)
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      saveUser(authResult.user)
      
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    }
  },
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/dashboard',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

function setErrorMsg(error) {
  return {
    loginMessage: error
  };
}

const raisedBtn = {
  margin: 15
};

const container = {
  textAlign: 'center',
  paddingTop:110
};

const style = {
  raisedBtn,
  container
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginMessage: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    login(this.state.email, this.state.password).catch(error => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };
  resetPassword = e => {
    e.preventDefault();
    resetPassword(this.state.email)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.state.email}.`)
        )
      )
      .catch(error => this.setState(setErrorMsg(`Email address not found.`)));
  };

  moveColl = e => {
    e.preventDefault();
    mv()
  }

  render() {
    return(<div style={style.container}>
      <button onClick={(e) => { this.moveColl(e)}}>Move colelction</button>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>)
    /*return (
      <form
        style={style.container}
        onSubmit={event => this.handleSubmit(event)}
      >
        <h3>Login</h3>
        <TextField
          hintText="Enter your Email"
          floatingLabelText="Email"
          onChange={(event, newValue) => this.setState({email: newValue})}
        />
        <br />
        <TextField
          type="password"
          hintText="Enter your Password"
          floatingLabelText="Password"
          onChange={(event, newValue) => this.setState({password: newValue})}
        />
        <br />
        {this.state.loginMessage && (
          <div className="alert alert-danger" role="alert">
            <span
              className="glyphicon glyphicon-exclamation-sign"
              aria-hidden="true"
            />
            <span className="sr-only">Error:</span>
            &nbsp;{this.state.loginMessage}{' '}
            <Link href="#" onClick={this.resetPassword}>
            Forgot Password?
            </Link>
          </div>
        )}
        <RaisedButton
          label="Login"
          primary={true}
          style={style.raisedBtn}
          type="submit"
        />
      </form>
    );*/
  }
}
