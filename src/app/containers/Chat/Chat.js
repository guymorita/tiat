import React from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  renderInputToolbar(props) {
    return (
      <View style={styles.inputToolbar}>
        {this.renderOptionBubble()}
        {this.renderOptionBubble()}
      </View>
    );
  }

  renderOptionBubble() {
    return (
      <View style={styles.bottomBubble}>
        <TouchableOpacity onPress={this._onNextPress.bind(this)}>
          <Text
            style={styles.optionBubble}
            numberOfLines={2}>
            So have you met any cool people on this app?
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAccessory(props) {
    return (
      <View>
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
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        renderAccessory={this.renderAccessory.bind(this)}
        messages={this.state.messages}
        bottomOffset={100}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  composerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: 'red',
    bottom: 0
  },
  inputToolbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bottomBubble: {
    borderRadius: 15,
    borderBottomRightRadius: 0,
    backgroundColor: 'red',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 20,
    justifyContent: 'center',
    height: 70,
    flex: 1
  },
  optionBubble: {
    color: 'white'
  }
})