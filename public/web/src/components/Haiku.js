import React from 'react';
import '../App.css';
import thumbUp from '../images/thumb_up.png';
import thumbDown from '../images/thumb_down.png';
import TimeAgo from 'react-timeago';
import request from 'request';

const baseUrl = window.location.protocol + '//' + window.location.host; 

export default class Haiku extends React.Component {

  constructor(props) {
    super(props);
  }

  upvote(event) {
    // event.preventDefault();
    // this.vote('up');
  }

  downvote(event) {
    // event.preventDefault();
    // this.vote('down');
  }

  vote(direction) {
    let voteParams = {
      uri: `${baseUrl}/api/v1/haiku/${this.props.haiku._id}/${direction}vote`,
      method: 'PUT',
    };
    if (this.props.haiku && this.props.haiku.myvote && this.props.haiku.myvote.direction === direction) {
      // We have already voted this direction. Delete the vote.
      voteParams = {
        uri: `${baseUrl}/api/v1/haiku/${this.props.haiku._id}/vote`,
        method: 'DELETE',
      };
    }
    let that = this;
    try {
      request(voteParams, function(err, resp, data) {
        if (err) {
          console.log('Voting error: ' + err);
        } else {
          let haiku = JSON.parse(data)['haiku'];
          that.props.setHaiku(haiku);
        }
      });
    } catch(e) {
      console.log('Error putting vote data: ' + e);
    }
  }

  render() {
    let fontSize = 12;
    if (this.props.haiku.upvotes) {
      fontSize = fontSize + this.props.haiku.upvotes;
    }
    let upvoteInc = this.props.haiku.upvotes || 0;
    let fontNum = 160 - (upvoteInc * 4);
    if (fontNum < 1) {
      fontNum = 1;
    }
    let hex = fontNum.toString(16);
    let fontColor = '#' + hex + hex + hex;
    let voteBox = <div style={{paddingLeft: '15px', display: 'inline'}}>
      <button style={{backgroundColor: this.props.haiku.myvote && this.props.haiku.myvote.direction === 'up' ? '#80b999' : 'white'}} onClick={() => this.vote('up')}>
        <img style={{width: '14px'}} src={thumbUp} />
        <span style={{fontSize: '12px'}}>{this.props.haiku.upvotes}</span>
      </button>
      <button style={{backgroundColor: this.props.haiku.myvote && this.props.haiku.myvote.direction === 'down' ? '#b98099' : 'white'}} onClick={() => this.vote('down')}>
        <img style={{width: '14px'}} src={thumbDown} />
        <span style={{fontSize: '12px'}}>{this.props.haiku.downvotes}</span>
      </button>
    </div>;
    let longest = [this.props.haiku.line1, this.props.haiku.line2, this.props.haiku.line3].sort((a,b) => a.length > b.length).pop();
    let width = Math.round((fontSize - 2) * longest.length) + 'px';
    fontSize = fontSize + 'px';
    return (
      <div style={{position: 'absolute', width: width, display: 'inline', top: this.props.haiku.top, left: this.props.haiku.left}}>
	      <div><span style={{fontFamily: this.props.haiku.font, fontSize: fontSize, color: fontColor}}>{this.props.haiku.line1}</span></div>
	      <div><span style={{fontFamily: this.props.haiku.font, fontSize: fontSize, color: fontColor}}>{this.props.haiku.line2}</span></div>
	      <div><span style={{fontFamily: this.props.haiku.font, fontSize: fontSize, color: fontColor}}>{this.props.haiku.line3}</span></div>
	      <div style={{paddingTop: '5px', display: 'inline'}}><b>{this.props.haiku.username}</b></div>{voteBox}
        <br />
        <TimeAgo style={{color: '#999999'}} date={this.props.haiku.created_at} />
      </div>
    );
  }
}
