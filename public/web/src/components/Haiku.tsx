import React, { useState, useEffect } from 'react';
import '../App.css';
import thumbUp from '../images/thumb_up.png';
import thumbDown from '../images/thumb_down.png';
import TimeAgo from 'react-timeago';
import VoteBox from './VoteBox';
import { HaikuProps, HaikuType } from '../types';

function Haiku({ data }: HaikuProps) {
  const [haiku, setHaiku] = useState<HaikuType>(data);
  const [fontSize, setFontSize] = useState<number | string>(12);
  const [width, setWidth] = useState<string>();
  const [fontColor, setFontColor] = useState<string>();

  const vote = async (direction: 'up' | 'down'): Promise<void> => {
    let voteParams: {
      uri: string;
      method: string;
    } = {
      uri: `/api/v1/haiku/${haiku._id}/${direction}vote`,
      method: 'PUT',
    };
    
    if (haiku?.myvote?.direction === direction) {
      // We have already voted this direction. Delete the vote.
      voteParams = {
        uri: `/api/v1/haiku/${haiku._id}/vote/${haiku.myvote._id}`,
        method: 'DELETE',
      };
    }
    
    try {
      const data = await fetch(voteParams.uri, { method: voteParams.method });
      if (data && data.status === 200) {
        let haikuData = await data.json();
        haikuData.myvote = { direction: direction };
        await setHaiku(haikuData['haiku']);
      }
    } catch(e) {
      console.log('Error putting vote data: ' + e);
    }
  }

  useEffect(() => {
    let longest = [haiku.line1, haiku.line2, haiku.line3].sort((a, b) => a.length > b.length ? 1 : -1).pop() || '';
    if (fontSize) {
      let w = Math.round((typeof fontSize === 'number' ? fontSize - 2 : parseInt(fontSize) - 2) * longest.length) + 'px';
      setWidth(w);
    }
    if (haiku?.upvotes) {
      setFontSize((typeof fontSize === 'number' ? fontSize + haiku.upvotes : parseInt(fontSize) + haiku.upvotes) + 'px');
    }
    (document as any).haiku = haiku;
  }, []);

  return(
    <div id='hdiv'
         style={{position: 'absolute', width: width, display: 'inline', top: `${haiku.top}px`, left: `${haiku.left}px`}}>
     <div><span style={{fontFamily: haiku.font, fontSize: fontSize, color: fontColor}}>{haiku.line1}</span></div>
     <div><span style={{fontFamily: haiku.font, fontSize: fontSize, color: fontColor}}>{haiku.line2}</span></div>
     <div><span style={{fontFamily: haiku.font, fontSize: fontSize, color: fontColor}}>{haiku.line3}</span></div>
     <div style={{paddingTop: '5px', display: 'inline'}}><b>{haiku.username}</b></div>
      <VoteBox haiku={haiku} vote={vote} />
      <br />
      <TimeAgo style={{color: '#999999'}} date={haiku.created_at} />
    </div>
  );
}

export default Haiku;