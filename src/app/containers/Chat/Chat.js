import React from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import Demo from './DemoChat'

user1 = {
  _id: 1,
  name: 'Me',
  avatar: 'https://s-media-cache-ak0.pinimg.com/736x/47/5e/0f/475e0f1362a7526c16d604f5dac47b86.jpg',

}

user2 = {
  _id: 2,
  name: 'Ana',
  avatar: 'https://s-media-cache-ak0.pinimg.com/736x/47/5e/0f/475e0f1362a7526c16d604f5dac47b86.jpg',
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      demoMessages: Demo.messages,
      currentLine: 0
    }
  }

  showNextBubble() {
    const currentLine = this.state.currentLine
    const nextMessage = this.state.demoMessages[currentLine]
    const isColin = nextMessage._id === 1
    nextMessage.user = isColin ? user1 : user2
    nextMessage._id = currentLine

    this.setState(() => {
      return {
        messages: GiftedChat.append(this.state.messages, nextMessage),
        currentLine: currentLine + 1
      };
    });
  }

  _onNextPress() {
    this.showNextBubble()
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
          color: 'white',
        }
        }}
        wrapperStyle={{
          right: {
            backgroundColor: 'red'
          }
        }}
      />
    );
  }

  renderComposer(props) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1}}>
        <Button
        title="Next"
        onPress={this._onNextPress.bind(this)}
        />
      </View>
    );
  }

  componentWillMount() {
    this.setState({
      messages: [
      ],
    });
  }

  render() {
    return (
      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        renderComposer={this.renderComposer.bind(this)}
        messages={this.state.messages}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
