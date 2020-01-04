import React, { Component } from 'react';
import './Popup.css';

class Popup extends Component {
  componentDidMount() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('option.html'));
    }
  }

  render() {
    return null;
  }
}

export default Popup;
