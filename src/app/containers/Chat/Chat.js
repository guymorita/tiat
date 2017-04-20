
import React from 'react'
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import _ from 'lodash'
import moment from 'moment'
import reactMixin from 'react-mixin'
import timerMixin from 'react-timer-mixin'
import PushNotification from 'react-native-push-notification'

import { BABY_BLUE, LIGHT_GRAY, LIGHT_PURPLE, getBackgroundStyle, getBackgroundColor } from '../../lib/colors'
import {
  getMatch,
  initActiveChat,
  getCurrentMessage,
  getNextMessage,
  getNextNextMessage,
  hasJumped,
  hasLongWait,
  isUserOrNarrator,
  jumpUseTry,
  nextStep,
  switchBranchPushMessage,
  shouldWaitForMessage,
  shouldWaitForTerminate
} from '../../actions/chat'

const NEXT = 'NEXT'
const OPTIONS = 'OPTIONS'
const WAIT = 'WAIT'
const JUMP = 'JUMP'
const TRY_AGAIN = 'TRY_AGAIN'

const TEXT_COLOR_LIGHT = 'white'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      animatedStartValue: new Animated.Value(0),
      userHasInteracted: false,
      buttonsDisabled: false
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

  _onNextPress() {
    if (this.state.buttonsDisabled) return
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({userHasInteracted: true, buttonsDisabled: true})
    dispatch(nextStep(key))
  }

  _onOptionPress(option) {
    if (this.state.buttonsDisabled) return
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({userHasInteracted: true, buttonsDisabled: true})
    dispatch(switchBranchPushMessage(key, option.target_thread))
  }

  _onJumpPress(key) {
    if (this.state.buttonsDisabled) return
    const { dispatch } = this.props
    this.setState({userHasInteracted: true, buttonsDisabled: true})
    dispatch(jumpUseTry(key))
  }

  _onTryAgainPress() {
    if (this.state.buttonsDisabled) return
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({
      messages: [],
      buttonsDisabled: true
    }, () => {
      dispatch(initActiveChat(key))
    })
  }

  renderBubble(props) {
    const { currentMessage } = props
    const { platform } = currentMessage
    const firstBgColor = getBackgroundColor(platform)

    const secondBgColor = currentMessage.cha_id === 2 ? BABY_BLUE : LIGHT_GRAY

    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
          color: TEXT_COLOR_LIGHT,
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

  cycleFooterAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.animatedStartValue, {
        toValue: 1,
        duration: 3000
      }),
      Animated.timing(this.state.animatedStartValue, {
        toValue: 0,
        duration: 2000
    })
    ]).start((event) => {
      if (event.finished) {
        this.cycleFooterAnimation()
      }
    });
  }

  renderTapBelow() {
    return (
      <Text style={styles.footerText}>
        &#8595; Tap below &#8595;
      </Text>
    );
  }

  renderWaitingFooter(timeToRestart) {
    return (
      <Text style={styles.footerText}>
        Wait {moment.duration(timeToRestart * 1000).humanize()} or Use a Jump
      </Text>
    );
  }

  renderFooter () {
    const { userHasInteracted } = this.state
    const { curChat, date } = this.props
    let footerComp = this.renderTapBelow
    let waitingToRestart = false

    const isTerminated = curChat.terminate.isTerminated
    if (isTerminated) {
      const dateNow = date.opened_today.modified
      const { dateRetry } = curChat.terminate
      waitingToRestart = dateRetry > dateNow

      if (waitingToRestart) {
        const timeToRestart = dateRetry - dateNow
        footerComp = this.renderWaitingFooter.bind(this, timeToRestart)
      }
    }

    if (!userHasInteracted || waitingToRestart) {
      return (
        <View>
          <Animated.View
            style={[styles.footer, {
              opacity: this.state.animatedStartValue
            }]}
          >
            {footerComp()}
          </Animated.View>
        </View>
      )
    } else {
      return (<View style={styles.footer}></View>)
    }
  }

  getInput = (curInput) => {
    switch(curInput) {
      case NEXT:
        return this.renderNextBubble
      case OPTIONS:
        return this.renderBranchOptions
      case JUMP:
        return this.renderJumpBubble
      case TRY_AGAIN:
        return this.renderTerminatedBubble
      case WAIT:
        return this.renderWaitingBubble
      default:
        return this.renderNextBubble
    }
  }

  renderInputToolbar() {
    const { curChat, curInput, date } = this.props
    const { key } = curChat

    return (
      <View style={styles.inputToolbar}>
        {this.getInput(curInput)(key)}
      </View>
    )
  }

  renderBranchOptions = () => {
    const { curChat, curThread, match } = this.props
    const { branch } = curThread
    const { options } = branch

    return this.renderOptionBubbles(options, curThread)
  }

  renderOptionBubbles(options, curThread) {
    return options.map((option) => {
      { return this.renderOptionBubble(option, curThread) }
    })
  }

  renderOptionBubble(option, curThread) {
    const { platform } = curThread
    const backgroundStyle = getBackgroundStyle(platform)

    return (
      <TouchableOpacity key={option.dec_id} style={styles.optionBubbleTouch} onPress={this._onOptionPress.bind(this, option)}>
        <View  style={[styles.bubbleBase, styles.optionBubble, backgroundStyle]}>
          <Text
            style={styles.optionBubbleText}
            numberOfLines={2}>
            {option.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderNextBubble = () => {
    const backgroundStyle = getBackgroundStyle(this.props.platform)

    return (
      <TouchableOpacity onPress={this._onNextPress.bind(this)}>
        <View style={[styles.bubbleBase, styles.centerBubble, backgroundStyle]}>
          <Text
            style={styles.nextBubbleText}>
            Next
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderJumpBubble = (key) => {
    return (
      <TouchableOpacity onPress={this._onJumpPress.bind(this, key)}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.longWaitBubble]}>
          <Text style={styles.whiteText}>
            Jump
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderWaitingBubble = () => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.waitBubble]}>
          <Text>
            Waiting
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderTerminatedBubble = () => {
    return (
      <TouchableOpacity onPress={this._onTryAgainPress.bind(this)}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.endBubble]}>
          <Text style={styles.whiteText}>
            Try again
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderAccessory(props) {
    return (
      <View>
      </View>
    );
  }

  componentWillMount() {
    const { curChat, date, dispatch } = this.props
    let initialMessages = []

    if (curChat) {
      const { giftedChat } = curChat
      initialMessages = giftedChat.messages
    }

    this.setState({
      messages: _.cloneDeep(initialMessages).reverse()
    });
  }

  componentWillReceiveProps(nextProps) {
    const { curChat } = nextProps

    this.setState({
      buttonsDisabled: false
    })

    const { giftedChat } = curChat
    const { messages } = giftedChat

    if (curChat.terminate.isTerminated) {
      PushNotification.requestPermissions()
    }

    const hasNewMessage = this.state.messages.length !== messages.length
    if (hasNewMessage) {
      this.setState({
        messages: GiftedChat.append(this.state.messages, messages[messages.length - 1])
      })
    }
  }

  componentDidMount() {
    const { messages } = this.state
    const { curChat, dispatch } = this.props
    if (messages.length === 0 && !_.isEmpty(curChat)) {
      this.setTimeout(
        () => {
          const { key } = curChat
          dispatch(nextStep(key))
        },
        1000
      )
    }

    this.setTimeout(
      () => {this.cycleFooterAnimation(); },
      1500
    )
  }

  render() {
    const { characters, curChat, isActive } = this.props
    if (!isActive) {
      return (<View><Text>...</Text></View>)
    }

    const char = characters.find((cha) => { return cha.key === curChat.key})
    const first_name = char && char.first_name

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: first_name}}
        />
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
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
  inputToolbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footer: {
    alignItems: 'center',
    marginTop: 10
  },
  footerText: {
    color: '#444'
  },
  bubbleBase: {
    flex: 1,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    marginTop: 10,
    minHeight: 20,
    justifyContent: 'center',
    height: 70
  },
  centerBubble: {
    marginLeft: 50,
    marginRight: 50,
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'center',
  },
  longWaitBubble: {
    backgroundColor: LIGHT_PURPLE
  },
  waitBubble: {
    backgroundColor: LIGHT_GRAY
  },
  endBubble: {
    backgroundColor: '#888'
  },
  whiteText: {
    color: 'white'
  },
  nextBubbleText: {
    fontSize: 16,
    color: TEXT_COLOR_LIGHT
  },
  optionBubbleTouch: {
    flex: 1
  },
  optionBubble: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  optionBubbleText: {
    color: TEXT_COLOR_LIGHT
  }
})

const getCurrentInput = function(curChat, curThread, date) {
  if (curChat.atBranch) return OPTIONS
  if (curChat.terminate.isTerminated) {
    if (shouldWaitForTerminate(curChat, date) && !hasJumped(curChat)) {
      return JUMP
    }
    return TRY_AGAIN
  }

  const curMessage = getCurrentMessage(curChat, curThread)
  const nextMessage = getNextMessage(curChat, curThread)

  const { cha_id } = curMessage || nextMessage
  if (isUserOrNarrator(cha_id)) return NEXT
  if (!shouldWaitForMessage(curChat, curThread, date)) return NEXT

  if (!curMessage || !nextMessage || curMessage.cha_id !== nextMessage.cha_id) return NEXT

  if (hasLongWait(curMessage)) {
    return JUMP
  } else {
    return WAIT
  }
}

const mapStateToProps = function(state) {
  const { activeChats, characters, currentChat, date } = state
  const { key } = currentChat

  const match = getMatch(state, key)
  const curChat = activeChats[key]
  const isActive = !_.isEmpty(curChat)
  const platform = match && match.threads[curChat.thread].platform
  let curInput, curThread

  if (isActive) {
    curThread = match.threads[curChat.thread]
    curInput = getCurrentInput(curChat, curThread, date)
  }

  return {
    characters,
    curChat,
    curInput,
    curThread,
    date,
    isActive,
    key,
    match,
    platform
  }
}

reactMixin(Chat.prototype, timerMixin)

export default connect(mapStateToProps)(Chat)
