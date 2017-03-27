
import React from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import _ from 'lodash'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'

user1 = {
  _id: 1,
  avatar: 'https://s-media-cache-ak0.pinimg.com/736x/47/5e/0f/475e0f1362a7526c16d604f5dac47b86.jpg'
}

user2 = {
  _id: 2,
  avatar: 'https://s-media-cache-ak0.pinimg.com/736x/47/5e/0f/475e0f1362a7526c16d604f5dac47b86.jpg'
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { characters, chat, matches } = props
    const { currentChat } = chat
    const { key } = currentChat
    let threads = {}
    let match = {}

    const character = characters.find((char) => { return char.key === key })

    if (key) {
      match = matches.find((match) => { return match.key === key })
      threads = match.threads
    }

    this.state = {
      messages: [],
      currentLineRender: 0,
      currentChat: {
        key,
        thread: 'a',
        msg_id: 0,
        atBranch: false
      },
      match,
      threads,
      character
    }
  }

  leftButtonConfig = {
    title: 'Back',
    tintColor: 'black',
    handler: () => this._onBackPress(),
  }

  _onBackPress() {
    const { navigator } = this.props
    navigator.pop()
  }

  nextStep() {
    const { currentChat, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const { msg_id } = currentChat
    const { messages } = currentThread
    let nextIsBranch = true
    if (messages.length) {
      const lastMessage = _.last(messages)
      nextIsBranch = msg_id >= lastMessage.msg_id
    }
    if (!nextIsBranch) {
      this.showNextBubble()
    } else {
      this.execBranch()
    }
  }

  showNextBubble(){
    const { currentChat, currentLineRender, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const { msg_id } = currentChat
    const { messages } = currentThread
    const nextMessage = messages.find((msg) => { return msg.msg_id === msg_id })
    const isColin = nextMessage.cha_id === 1
    nextMessage.user = isColin ? user1 : user2
    nextMessage._id = currentLineRender

    this.setState(() => {
      return {
        messages: GiftedChat.append(this.state.messages, nextMessage),
        currentLineRender: currentLineRender + 1,
        currentChat: {
          ...currentChat,
          msg_id: currentChat.msg_id + 1
        }
      };
    });
  }

  execBranch() {
    const { currentChat, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const { branch } = currentThread

    switch(branch.branch_type) {
      case 'linear':
        const { branch_target } = branch
        this.switchBranch(branch_target)
        return
      case 'multi':
        this.setState({
          currentChat: {
            ...currentChat,
            atBranch: true
          }
        })
        return
      case 'terminal':
        console.log('terminal')
        return
    }
  }

  switchBranch(branch_target) {
    const { currentChat } = this.state

    this.setState({
      currentChat: {
        ...currentChat,
        thread: branch_target,
        msg_id: 0,
        atBranch: false
      }
    }, () => {
      this.nextStep()
    })
  }

  _onNextPress() {
    this.nextStep()
  }

  _onOptionPress(option) {
    this.switchBranch(option.target_thread)
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
    const { currentChat } = this.state
    const { atBranch } = currentChat

    if (atBranch) {
      return this.renderBranchOptions()
    } else {
      return this.renderNextBubble()
    }
  }

  renderBranchOptions() {
    const { currentChat, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const { branch } = currentThread
    const { options } = branch

    return (
      <View style={styles.inputToolbar}>
        { this.renderOptionBubbles(options) }
      </View>
    );
  }

  renderOptionBubbles(options) {
    return options.map((option) => {
      { return this.renderOptionBubble(option) }
    })
  }

  renderOptionBubble(option) {
    return (
      <View key={option.dec_id} style={styles.bottomBubble}>
        <TouchableOpacity onPress={this._onOptionPress.bind(this, option)}>
          <Text
            style={styles.optionBubble}
            numberOfLines={2}>
            {option.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderNextBubble() {
    return (
      <View style={styles.inputToolbar}>
        <TouchableOpacity onPress={this._onNextPress.bind(this)}>
          <View style={styles.nextBubble}>
            <Text
              style={styles.nextBubbleText}>
              Next
            </Text>
          </View>
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
    const { character } = this.state
    const first_name = character && character.first_name || "Ann"
    console.log('first_name', first_name)
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: first_name}}
        />
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
  nextBubble: {
    borderRadius: 15,
    borderBottomRightRadius: 0,
    backgroundColor: 'red',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    flex: 1

  },
  nextBubbleText: {
    fontSize: 16,
    color: 'white'
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

const mapStateToProps = function(state) {
  const { characters, chat, matches } = state

  return {
    characters,
    chat,
    matches
  }
}
export default connect(mapStateToProps)(Chat)
