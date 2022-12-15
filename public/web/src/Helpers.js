import React from 'react';
import Login from './components/Login';
import request from 'request';

const baseUrl = window.location.protocol + '//' + window.location.host;

export const getUserInfo = (app, username=undefined) => {
  console.log('GET USER INFO CALLED WITH USERNAME: ' + username);
  let userUrl = `${baseUrl}/api/v1/users/me?include_area=true&include_counts=true`;
  let that = app;
  if (username) {
    userUrl = `${baseUrl}/api/v1/users/${username}`;
  }
  try {
    request({uri: userUrl}, function(err, data)  {
      if (data) {
        let parsedBody = JSON.parse(data.body);
        if (parsedBody && parsedBody['users'] && parsedBody['users']['area']) {
          if (!username) {
            that.setState({
              user: parsedBody['users'],
              area: parsedBody['users']['area'],
              messageCounter: parsedBody['users']['unread_message_count'],
              notificationCounter: parsedBody['users']['unseen_notifications_count'],
            });
          } else {
            console.log('  RETURNING PARSED BODY USERS: ' + JSON.stringify(parsedBody['users']));
            let cusers = that.state.conversationUsers || [];
            cusers.push(parsedBody['users']);
            that.setState({conversationUsers: cusers});
          }
        } else {
          that.setState({login: <Login mainApp={that} />});
        }
      } else {
        console.log('Got nothing: err is: ' + err);
      }
    });
  } catch(e) {
    console.log('Me call unsuccessful.');
    if ( e.statusCode && e.statusCode === 401) {
      // Show login page..
      console.log('  Got 401.. Need to login');
      that.setState({login: <Login mainApp={that} />});
    }
  }
}

export const updateUserInfo = (app, data) => {
  console.log('Submitting post...');
  console.log('Data is...');
  console.log(data);
  let requestData = {
    uri: `${baseUrl}/api/v1/users/me?include_area=true&include_counts=true`,
    method: 'PUT'
  };
  if (!data['uploadedStringImage']) {
    requestData['headers'] = {'content-type': 'application/json'};
    requestData['body'] = JSON.stringify({'user': {'username': data['username'], 'summary': data['summary'], 'conv_block_users': data['conv_block_users']}});
  } else {
    console.log('Got uploaded image.');
    let imgBuf = new Buffer(data['uploadedStringImage'].replace(/^data:image\/\w+;base64,/, ""),'base64');
    requestData['headers'] = {'content-type': 'multipart/form-data'};
    requestData['multipart'] = {
      data: [
        {
          'Content-Disposition': 'form-data; name="user[username]"',
          'body': data['username'],
        },
        {
          'Content-Disposition': 'form-data; name="user[summary]"',
          'body': data['summary'],
        },
        {
          'Content-Disposition': 'form-data; name="user[conv_block_users]"',
          'body': data['conv_block_users'],
        },
        {
          'Content-Disposition': 'form-data: name="user[avatar]"; filename="userImage.png"',
          'body': imgBuf,
        }
      ],
    }
  }
  try {
    request(requestData, (err, userData) => {
      if (userData && userData.body) {
        let updatedUser = JSON.parse(userData.body)['users'];
        // TODO - Do something better than just alert here...
        // alert('Update successful.');
        if (data['uploadedStringImage']) {
          // reload so that all occurences of the avatar get updated.
          window.location.reload();
        } else {
          if (app && app.setState) {
            app.setState({user: updatedUser});
          }
        }
      } else if (err) {
        console.log('[updateUserInfo] update error: ' + err);
      }
    });
  } catch(e) {
     console.log('[updateUserInfo] caught update error: ' + e);
  }
};

export const ellipses = (text, previewLimit=18) => {
  if (text && text.length > previewLimit) {
    return text.substr(0, previewLimit) + '...';
  } else {
    return text;
  }
}
