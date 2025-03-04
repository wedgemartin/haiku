import React, { Component } from 'react';
import Haiku from './components/Haiku';
import HaikuForm from './components/HaikuForm';
import request from 'request';
import './App.css';

// TODO 
//    - deduplicate upvotes
//    - factor in downvotes.. zoom / font should be upvotes minus downvotes
//    - too many downvotes make haiku disappear.. or even delete.

const docTitle = 'Haiku';
const baseUrl = window.location.protocol + '//' + window.location.host;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {showOverlay: true, haikus: [], counter: 0, mousedown: false, pageX: 0, pageY: 0};
  }

  doMove(app, init=false, dragEvent=undefined) {
    // let haikus = this.state.haikus;
    let haikus = app.state.haikus;
    if (!init) {
      let px = app.state.pageX || dragEvent.pageX;
      let py = app.state.pageY || dragEvent.pageY;
      if (app.state.pageX && dragEvent.pageX) {
        // We have a delta to process.
        let xdelt = app.state.pageX - dragEvent.pageX;
        let ydelt = app.state.pageY - dragEvent.pageY;
        let newHaikus = [];
        for (let i = 0; i < app.state.haikus.length; i++) {
          let haiku = app.state.haikus[i];
          let moveBonus = haiku.upvotes || 1;
          haiku.left = haiku.left + (xdelt * (moveBonus / 3));
          haiku.top = haiku.top + (ydelt * (moveBonus / 3));
          newHaikus.push(haiku);
        }
        app.setState({pageY: dragEvent.pageY, pageX: dragEvent.pageX, haikus: newHaikus});
      } else {
        app.setState({pageY: dragEvent.pageY, pageX: dragEvent.pageX});
      }
    } else {
      // console.log("haikus:" + app.state.haikus);
      // console.log("counter:" + app.state.counter);
      // console.log("init:" + init);
      let leftNeg = Math.random(1);
      let counter = app.state.counter;
      let leftnegative = false;
      if (leftNeg < 0.5 || init) {
        leftnegative = true;
      }
      let topNeg = Math.random(1);
      let topnegative = false;
      if (topNeg < 0.5 || init) {
        topnegative = true;
      }
      // let leftRand = 0;
      // let topRand = 0;
      let leftRand = 20 - (counter * 2);
      let topRand = 20 - (counter * 2);
      let newHaikus = [];
      if (counter < 30) {
        for (let i = 0; i < haikus.length; i++) {
          let haiku = app.state.haikus[i];
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
        let counter = app.state.counter + 1;
        app.setState({haikus: newHaikus, counter: counter});
      } else {
        if (init && counter >= 5) {
          clearInterval(app.state.interval);
        }
      }
    } 
  }

  getHaikus() {
    let getParams = {
      uri: `${baseUrl}/api/v1/haiku`,
      method: 'GET',
    };
    let that = this;
    try {
      request(getParams, function(err, resp, data) {
        if (err) {
          console.log('Error fetching haikus: ' + err);
        } else {
          console.log('  DATA1: ' + data);
          console.log('  DATA3: ' + JSON.stringify(data));
          let haikus = JSON.parse(data)['haiku'];
          if (!haikus) {
            console.log('Something is wrong with our fetch: ' + data);
            return;
          } else {
            let goodHaikus = [];
            for (let i = 0; i < haikus.length; i++) {
              const h = haikus[i];
              if (h.downvotes < 5 || (h.upvotes > h.downvotes)) {
                goodHaikus.push(h);
              }
            }
            let interval = setInterval(that.doMove, 50, that, true);
            that.setState({interval: interval, haikus: goodHaikus});
          }
        }
      });
    } catch(e) {
      console.log('Error getting haiku data: ' + e);
    }
  }

  addHaiku(haiku) {
    let newHaikus = [];
    for (let i = 0; i < this.state.haikus.length; i++) {
      newHaikus.push(this.state.haikus[i]);
    }
    newHaikus.push(haiku);
    this.setState({haikus: newHaikus});
  }

  updateHaiku(haiku) {
    let newHaikus = [];
    for (let i = 0; i < this.state.haikus.length; i++) {
      let h = this.state.haikus[i];
      if (h._id.$oid == haiku._id.$oid) {
        haiku.top = h.top;
        haiku.left = h.left;
        newHaikus.push(haiku);
      } else {
        newHaikus.push(h);
      }
    }
    this.setState({haikus: newHaikus});
  }

  componentWillMount() {
    //  TODO - Make call to get Haikus.
    console.log("  Calling getHaikus...");
    this.getHaikus();
    let that = this;
    document.onmousedown = (e) => this.setState({mousedown: true, pageX: e.target.pageX, pageY: e.target.pageY});
    document.onmouseup = () => this.setState({mousedown: false});
    document.onmousemove = (e) => {if (that.state.mousedown) { that.doMove(this, false, e) }};
  }

  render() {
    let overlay = <div onClick={() => this.setState({showOverlay: false})}
                       style={{position: 'absolute',
                               display: this.state.showOverlay ? 'inline-block' : 'none',
                               textAlign: 'center',
                               width: window.innerWidth - 400,
                               padding: 40,
                               left: '154px',
                               top: '280px',
                               borderRadius: 14,
                               opacity: 0.5,
                               backgroundColor: '#dfdfdf'}}>
                    <span style={{fontSize: 32}}>Click and drag to peruse the haikus</span>
                  </div>;

    let haikus = [];
    for (let i = 0; i < this.state.haikus.length; i++) {
      let haiku = this.state.haikus[i];
      if (!haiku.top) {
        haiku.top = Math.abs(Math.random(window.innerHeight) * window.innerHeight);
        haiku.left = Math.abs(Math.random(window.innerWidth) * window.innerWidth);    
      }
      haikus.push(<Haiku setHaiku={(data) => this.updateHaiku(data)} key={haiku._id.$oid} haiku={haiku} />);
    }
    return (
      <div onClick={() => this.setState({showOverlay: false})} onmousedrag={(event) => this.doMove(this, false, event)} style={{width: window.innerWidth, height: window.innerHeight, overflow: 'hidden'}}>
        {overlay}
        {haikus}
        <HaikuForm addHaiku={(haiku) => this.addHaiku(haiku)} />
      </div>
    );
  }
}

export default App;
