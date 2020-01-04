import React, { Component } from 'react';
import './Popup.css';

class Popup extends Component {
  componentDidMount() {
    console.log('hi');
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }

  render() {
    return null;
  }
}

export default Popup;
