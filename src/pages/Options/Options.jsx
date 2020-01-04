import React, { Component } from 'react';
import './Options.css';
import GoogleLogin from 'react-google-login';

const responseGoogle = (response) => {
  console.log(response);
};

class Options extends Component {
  render() {
    return (
      <div className="OptionsContainer">
        <GoogleLogin
          clientId="370628627422-fsjedimspet8vlasr831rj51l3pn6lpp.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </div>
    );
  }
}

export default Options;
