import React, { useState, useEffect, useRef } from 'react';
import Haiku from './components/Haiku';
import HaikuForm from './components/HaikuForm';
import './App.css';
// import useGetHaikus from './hooks/useGetHaikus';

const docTitle = 'Haiku';
const baseUrl = window.location.protocol + '//' + window.location.host;

function App() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [haikus, setHaikus] = useState();
  const [counter, setCounter] = useState(0);
  const [mousedown, setMousedown] = useState(false);
  const [pageX, setPageX] = useState(0);
  const [pageY, setPageY] = useState(0);
  const [overlay, setOverlay] = useState(0);
  const [intervalPid, setIntervalPid] = useState();
  const haikusRef = useRef(haikus);
  haikusRef.current = haikus;

  useEffect(() => {
    const url = '/api/v1/haiku';
    console.log('internal fetch useEffect...');
    console.log(' In internal fetch..');
    fetch(url)
      .then((res) => res.json())
      .then((hlist) => {
        console.log("  HLIST: " + JSON.stringify(hlist));
        let goodHaikus = [];
        for (let i = 0; i < hlist['haiku'].length; i++) {
          const h = hlist['haiku'][i];
          if (h.downvotes < 5 || (h.upvotes > h.downvotes)) {
            if (!h.top) {
              h.top = document.body.clientHeight * Math.random(document.body.clientHeight + (50 * hlist['haiku'].length));
              h.left = document.body.clientWidth * Math.random(document.body.clientWidth + (50 * hlist['haiku'].length));
            }
            goodHaikus.push(h);
          }
        }
        setHaikus(goodHaikus);
      });
    for (let i = 0; i < 7; i++) {
      setTimeout(doMove, (100 * i), true);
    }
  }, []);

  const doMove = async (init=false, dragEvent=undefined) => {
    if (!init) {
      let px = pageX || dragEvent?.pageX;
      let py = pageY || dragEvent?.pageY;
      if (pageX && dragEvent.pageX) {
        // We have a delta to process.
        let xdelt = pageX - dragEvent.pageX;
        let ydelt = pageY - dragEvent.pageY;
        let newHaikus = [];
        for (let i = 0; i < haikus.length; i++) {
          let haiku = haikus[i];
          let moveBonus = haiku.upvotes || 1;
          haiku.left = haiku.left + (xdelt * (moveBonus / 3));
          haiku.top = haiku.top + (ydelt * (moveBonus / 3));
          newHaikus.push(haiku);
        }
        setHaikus(newHaikus);
        setPageY(dragEvent.pageY);
        setPageX(dragEvent.pageX);
      }
    } else {
      const haikuArray = haikusRef.current;
      let leftNeg = Math.random(1);
      let leftnegative = false;
      if (leftNeg < 0.5 || init) {
        leftnegative = true;
      }
      let topNeg = Math.random(1);
      let topnegative = false;
      if (topNeg < 0.5 || init) {
        topnegative = true;
      }
      let leftRand = 20 - (counter * 2);
      let topRand = 20 - (counter * 2);
      let newHaikus = [];
      if (counter < 30 && haikuArray && haikuArray.length > 0) {
        for (let i = 0; i < haikuArray.length; i++) {
          let haiku = haikuArray[i];
          let voteBonus = haiku.upvotes || 0;
          voteBonus = voteBonus * 1.5;
          if (haiku.top) {
            if (topnegative) {
              haiku.top = haiku.top - (topRand + voteBonus);
            } else {
              haiku.top = haiku.top + (topRand + voteBonus);
            }
            if (leftnegative) {
              haiku.left = haiku.left - (leftRand + voteBonus);
            } else {
              haiku.left = haiku.left + (leftRand + voteBonus);
            }
          }
          newHaikus.push(haiku);
        }
        // let c = parseInt(counter + 1);
        // setCounter(c);
        setHaikus(newHaikus);
      } else {
        if (init && counter >= 5) {
console.log(' Clearing interval: ' + intervalPid);
          clearInterval(intervalPid);
        }
      }
    } 
  }

  const addHaiku = (haiku) => {
    let newHaikus = [];
    for (let i = 0; i < haikus.length; i++) {
      newHaikus.push(haikus[i]);
    }
    if (!haiku.top) {
      haiku.top = document.body.clientHeight * Math.random(document.body.clientHeight + (50 * haikus.length));
      haiku.left = document.body.clientWidth * Math.random(document.body.clientWidth + (50 * haikus.length));
    }
    newHaikus.push(haiku);
    setHaikus(newHaikus);
  }

  const updateHaiku = (haiku) => {
    let newHaikus = [];
    for (let i = 0; i < haikus.length; i++) {
      let h = haikus[i];
      if (h._id == haiku._id) {
        haiku.top = h.top;
        haiku.left = h.left;
        newHaikus.push(haiku);
      } else {
        newHaikus.push(h);
      }
    }
    setHaikus(newHaikus);
  }

  useEffect(() => {
    setOverlay(<div onClick={() => setShowOverlay(false)}
                    style={{position: 'absolute',
                            display: showOverlay ? 'inline-block' : 'none',
                            textAlign: 'center',
                            width: window.innerWidth - 400,
                            padding: 40,
                            left: '154px',
                            top: '280px',
                            borderRadius: 14,
                            opacity: 0.5,
                            backgroundColor: '#dfdfdf'}}>
                 <span style={{fontSize: 32}}>Click and drag to peruse the haikus</span>
               </div>);
  }, []);

  return (
    <div onClick={() => setShowOverlay(false)}
         onMouseDown={(e) => {
           console.log('Setting mousedown to true...');
           setMousedown(true);
           setPageX(e.pageX);
           setPageY(e.pageY);
         }}
         onMouseUp={() => {console.log(" Setting mousedown False "); setMousedown(false)}}
         onMouseMove={(e) => {if (mousedown) { doMove(false, e) } else { console.log('Mouse not down..') }}}
         style={{width: window.innerWidth, height: window.innerHeight, overflow: 'hidden'}}
    >
      {showOverlay && overlay}
      {haikus && haikus !== undefined && haikus.map(h => <Haiku key={h._id} data={h} />)}
      <HaikuForm addHaiku={(haiku) => addHaiku(haiku)} />
    </div>
  );
}

export default App;
