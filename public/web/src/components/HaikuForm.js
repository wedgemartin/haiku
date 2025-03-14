import React from 'react';
import '../App.css';
// import request from 'request';
import FontPicker from 'font-picker-react';
import { syllable } from 'syllable';

const baseUrl = window.location.protocol + '//' + window.location.host;
const api_key = 'AIzaSyCNqC_CrzyHQK5HvLAODdif2vtNZNQojnc';

export default class HaikuForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      line1: '',
      line2: '',
      line3: '',
      username: '',
      error: '',
      message: '',
      activeFontFamily: 'Open Sans',
      line1error: false,
      line2error: false,
      line3error: false
    };
  }

  async submit() {
    let syncError = false;
    if (!this.state.line1 || !this.state.line2 || !this.state.line3) {
      this.setState({error: 'Must complete three lines for a haiku'});
      return;
    }
    if (!this.state.username) {
      this.setState({error: 'Must specify a username'});
      return;
    }
    if (syllable(this.state.line1) !== 5) {
      syncError = true;
      this.setState({error: 'Syllable count incorrect', line1error: true});
    } else if (this.state.line1error) {
      // Clear error.
      this.setState({line1error: false});
    }
    if (syllable(this.state.line2) !== 7) {
      syncError = true;
      this.setState({error: 'Syllable count incorrect', line2error: true});
    } else if (this.state.line2error) {
      this.setState({line2error: false});
    }
    if (syllable(this.state.line3) !== 5) {
      syncError = true;
      this.setState({error: 'Syllable count incorrect', line3error: true});
    } else if (this.state.line3error) {
      this.setState({line3error: false});
    }
    if (syncError) {
      return;
    }
    let url = `${baseUrl}/api/v1/haiku`;
    let that = this;
    let fd = new FormData();
    fd.append('line1', this.state.line1);
    fd.append('line2', this.state.line2);
    fd.append('line3', this.state.line3);
    fd.append('username', this.state.username);
    fd.append('font', this.state.activeFontFamily);
    try {
      const data = await fetch(url, {body: fd, method: 'POST'});
      let haikuJson = await data.json();
      let haiku = haikuJson['haiku'];
      if (haiku) {
        that.props.addHaiku(haiku);
        that.setState({
          error: '',
          line1error: false,
          line2error: false,
          line3error: false,
          line1: '',
          line2: '',
          line3: '',
          message: 'Haiku added successfully!'
        });
      } else {
        console.log('Bad haiku response?' + data.status);
      }
    } catch(e) {
      console.log('Error posting haiku data: ' + e);
    }
  }

  render() {
    let style = {
      zIndex: 9999999,
      padding: '10px',
      position: 'absolute',
      display: 'inline',
      top: '40px',
      left: '30px',
      border: 'solid 2px #cccccc',
      borderRadius: 8
    };
    let message = '';
    if (this.state.message) {
      if (this.state.message.indexOf('success') !== -1) {
        message = <span style={{color: '#40f040'}}>{this.state.message}</span>;
      } else {
        message = <span style={{color: '#f04040'}}>{this.state.message}</span>;
      }
    }
    return (
      <div style={style}>
        <div style={{paddingBottom: '5px'}}>
          <span style={{fontSize: '24px', color: '#4090a4'}}>haiku </span>
          <span style={{color: '#9040a4'}}>  do you?</span>
        </div>
        {message}
        <div><span style={{color: '#ff0000'}}>{this.state.error}</span></div>
	      <div>line1: <input style={{border: this.state.line1error ? "solid 1px #ff0000" : ''}} value={this.state.line1} onChange={(data) => this.setState({line1: data.target.value})} /></div>
	      <div>line2: <input style={{border: this.state.line2error ? "solid 1px #ff0000" : ''}} value={this.state.line2} onChange={(data) => this.setState({line2: data.target.value})} /></div>
	      <div>line3: <input style={{border: this.state.line3error ? "solid 1px #ff0000" : ''}} value={this.state.line3} onChange={(data) => this.setState({line3: data.target.value})} /></div>
	      <div>username: <input value={this.state.username} size={13} onChange={(data) => this.setState({username: data.target.value})} /></div>
        <FontPicker apiKey={api_key} activeFontFamily={this.state.activeFontFamily}
                    onChange={(nextFont) =>
                      this.setState({
                        activeFontFamily: nextFont.family,
                      })
                    }
        />

        <br />
        <button onClick={() => this.submit()}>Haiku!</button>
      </div>
    );
  }
}
