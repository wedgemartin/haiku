import React from 'react';
import thumbUp from '../images/thumb_up.png';
import thumbDown from '../images/thumb_down.png';
import { VoteBoxProps } from '../types';

function VoteBox({ haiku, vote }: VoteBoxProps) {
  return (
    <div style={{ paddingLeft: '15px', display: 'inline' }}>
      <button 
        style={{ backgroundColor: haiku.myvote && haiku.myvote.direction === 'up' ? '#80b999' : 'white' }} 
        onClick={() => vote('up')}
      >
        <img style={{ width: '14px' }} src={thumbUp} alt="Upvote" />
        <span style={{ fontSize: '12px' }}>{haiku.upvotes}</span>
      </button>
      <button 
        style={{ backgroundColor: haiku.myvote && haiku.myvote.direction === 'down' ? '#b98099' : 'white' }} 
        onClick={() => vote('down')}
      >
        <img style={{ width: '14px' }} src={thumbDown} alt="Downvote" />
        <span style={{ fontSize: '12px' }}>{haiku.downvotes}</span>
      </button>
    </div>
  );
}

export default VoteBox;