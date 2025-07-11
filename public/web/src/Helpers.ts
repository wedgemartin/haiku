import React from 'react';
import { UserType } from './types';

// Login component would need to be converted to TypeScript separately

const baseUrl = window.location.protocol + '//' + window.location.host;

interface AppWithState {
  setState: (state: any) => void;
  state: any;
}

export const getUserInfo = async (app: AppWithState, username?: string): Promise<void> => {
  console.log('GET USER INFO CALLED WITH USERNAME: ' + username);
  let userUrl = `${baseUrl}/api/v1/users/me?include_area=true&include_counts=true`;
  let that = app;
  if (username) {
    userUrl = `${baseUrl}/api/v1/users/${username}`;
  }
  try {
    const data = await fetch(userUrl);
    if (data && data.status === 200) {
      let parsedBody = await data.json();
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
        // Fixed: Removed Login component reference as it would need to be converted to TypeScript
        that.setState({login: "Login required" });
      }
    }
  } catch(e) {
    console.log('Me call unsuccessful.');
    if ((e as any).statusCode && (e as any).statusCode === 401) {
      // Show login page..
      console.log('  Got 401.. Need to login');
      // Fixed: Removed Login component reference as it would need to be converted to TypeScript
      that.setState({login: "Login required" });
    }
  }
};

interface UserUpdateData {
  username: string;
  summary: string;
  conv_block_users: string[];
  uploadedStringImage?: string;
}

export const updateUserInfo = async (app: AppWithState, data: UserUpdateData): Promise<void> => {
  console.log('Submitting post...');
  console.log('Data is...');
  console.log(data);
  const url = `${baseUrl}/api/v1/users/me?include_area=true&include_counts=true`;
  
  try {
    let requestData = new FormData();
    
    if (!data['uploadedStringImage']) {
      // Fixed: Removed duplicate variable declaration and syntax error
      requestData.append('body', JSON.stringify({
        'user': {
          'username': data['username'], 
          'summary': data['summary'], 
          'conv_block_users': data['conv_block_users']
        }
      }));
    } else {
      console.log('Got uploaded image.');
      let imgBuf = Buffer.from(data['uploadedStringImage'].replace(/^data:image\/\w+;base64,/, ""), 'base64');
      requestData.append('data', JSON.stringify({
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
      }));
    }
    
    const response = await fetch(url, {method: 'POST', body: requestData});
    const userData = await response.json();
    const updatedUser = userData['users'] as UserType;
    
    if (data['uploadedStringImage']) {
      window.location.reload();
    } else {
      if (app && app.setState) {
        app.setState({user: updatedUser});
      }
    }
  } catch(e) {
    console.log('[updateUserInfo] caught update error: ' + e);
  }
};

export const ellipses = (text: string, previewLimit: number = 18): string => {
  if (text && text.length > previewLimit) {
    return text.substr(0, previewLimit) + '...';
  } else {
    return text;
  }
};