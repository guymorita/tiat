
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

const TINDER_COLOR = '#ED7C61'
const IMESSAGE_COLOR = '#2D75FA'

const getBackgroundStyle = (platform) => {
  switch(platform) {
    case 'tinder':
      return styles.backgroundTinder
    case 'iMessage':
      return styles.backgroundiMessage
  }
}

const getBackgroundColor = (platform) => {
  switch(platform) {
    case 'tinder':
      return TINDER_COLOR
    case 'iMessage':
      return IMESSAGE_COLOR
  }
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
    let platform = 'tinder'

    if (key) {
      match = matches.find((match) => { return match.key === key })
      threads = match.threads
      firstThread = threads.a
      platform = firstThread.platform
    }

    this.state = {
      messages: [],
      currentLineRender: 0,
      currentChat: {
        key,
        thread: 'a',
        msg_id: 0,
        atBranch: false,
        platform
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

  getThumb(nextMessage) {
    const { characters } = this.props
    const { currentChat } = this.state
    const { key } = currentChat
    const { cha_id } = nextMessage
    if (nextMessage.cha_id === 2) {
      return 'https://www.playshakespeare.com/images/avatar/thumb_1b09da63a23c12d8d02185e9.jpg'
    } else if ( cha_id < 100) {
      return ''
    }
    const character = characters.find((char) => { return char.key === key })
    return character.images.thumb
  }

  setChaId(nextMessage) {
    // main character needs to be 1 to render on the right side
    if (nextMessage.cha_id > 10 && nextMessage.cha_id < 100) {
      return 1
    }
    return nextMessage.cha_id
  }

  showNextBubble(){
    const { currentChat, currentLineRender, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const { msg_id } = currentChat
    const { messages } = currentThread
    const nextMessage = messages.find((msg) => { return msg.msg_id === msg_id })

    nextMessage.user = {}
    nextMessage.user._id = this.setChaId(nextMessage)
    nextMessage.user.avatar = this.getThumb(nextMessage)
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
    const { currentChat, threads } = this.state
    const currentThread = threads[currentChat.thread]
    const newThread = threads[branch_target]

    this.setState({
      currentChat: {
        ...currentChat,
        thread: branch_target,
        msg_id: 0,
        atBranch: false,
        platform: newThread.platform
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
    const { currentChat } = this.state
    const firstBgColor = getBackgroundColor(currentChat.platform)
    const { currentMessage } = props
    const secondBgColor = currentMessage.cha_id === 2 ? '#D0E2F4': '#F0F0F0'
    // console.log('props', props)
    // #F0F0F0
    // #DCDCDC
    // #D0E2F4

    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
          color: 'white',
        }
        }}
        wrapperStyle={{
          left: {
            backgroundColor: secondBgColor
          },
          right: {
            backgroundColor: firstBgColor
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
    const { currentChat } = this.state
    const backgroundStyle = getBackgroundStyle(currentChat.platform)

    return (
      <TouchableOpacity key={option.dec_id} style={styles.bottomBubbleTouch} onPress={this._onOptionPress.bind(this, option)}>
        <View  style={[styles.bottomBubble, backgroundStyle]}>
          <Text
            style={styles.optionBubble}
            numberOfLines={2}>
            {option.text}
          </Text>

        </View>
      </TouchableOpacity>
    );
  }

  renderNextBubble() {
    const { currentChat } = this.state
    const backgroundStyle = getBackgroundStyle(currentChat.platform)

    return (
      <View style={styles.inputToolbar}>
        <TouchableOpacity onPress={this._onNextPress.bind(this)}>
          <View style={[styles.nextBubble, backgroundStyle]}>
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
  bottomBubbleTouch: {
    flex: 1
  },
  bottomBubble: {
    borderRadius: 15,
    borderBottomRightRadius: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 20,
    justifyContent: 'center',
    height: 80,
    flex: 1
  },
  optionBubble: {
    color: 'white'
  },
  backgroundTinder: {
    backgroundColor: TINDER_COLOR,
  },
  backgroundiMessage: {
    backgroundColor: IMESSAGE_COLOR
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
