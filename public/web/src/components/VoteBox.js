import React, {useState, useEffect} from 'react';
import thumbUp from '../images/thumb_up.png';
import thumbDown from '../images/thumb_down.png';

function VoteBox({haiku, vote}) {

  // const generateVoteBox = async () => {
    // //let upvoteInc = haiku.upvotes || 0;
    // let fontNum = 160 - (upvoteInc * 4);
    // if (fontNum < 1) {
      // fontNum = 1;
    // }
    // let hex = fontNum.toString(16);
    // let fc = '#' + hex + hex + hex;
    // setFontColor(fc);
  return (
    <div style={{paddingLeft: '15px', display: 'inline'}}>
      <button style={{backgroundColor: haiku.myvote && haiku.myvote.direction === 'up' ? '#80b999' : 'white'}} onClick={() => vote('up')}>
        <img style={{width: '14px'}} src={thumbUp} />
        <span style={{fontSize: '12px'}}>{haiku.upvotes}</span>
      </button>
      <button style={{backgroundColor: haiku.myvote && haiku.myvote.direction === 'down' ? '#b98099' : 'white'}} onClick={() => vote('down')}>
        <img style={{width: '14px'}} src={thumbDown} />
        <span style={{fontSize: '12px'}}>{haiku.downvotes}</span>
      </button>
    </div>
  );
}

export default VoteBox;
