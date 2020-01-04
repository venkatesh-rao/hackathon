import React, { Component } from 'react';
import './Options.css';
class Options extends Component {
  render() {
    chrome.storage.local.get(['hack_user_id'], function(result) {
      if (result.length) {
      } else {
        alert('No ID');
      }
    });
    return <div className="OptionsContainer">hii</div>;
  }
}

export default Options;
