
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

import { LIGHT_BLUE, LIGHT_GRAY, getBackgroundStyle, getBackgroundColor } from '../../lib/colors'
import { getMatch, initActiveChat, nextStep, switchBranchPushMessage, shouldWait } from '../../actions/chat'

const TEXT_COLOR_LIGHT = 'white'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      animatedStartValue: new Animated.Value(0),
      userHasInteracted: false
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
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({userHasInteracted: true})
    dispatch(nextStep(key))
  }

  _onOptionPress(option) {
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({userHasInteracted: true})
    dispatch(switchBranchPushMessage(key, option.target_thread))
  }

  _onTryAgainPress() {
    const { curChat, dispatch } = this.props
    const { key } = curChat
    this.setState({
      messages: []
    }, () => {
      dispatch(initActiveChat(key))
    })
  }

  renderBubble(props) {
    const firstBgColor = getBackgroundColor(this.props.platform)
    const { currentMessage } = props
    const secondBgColor = currentMessage.cha_id === 2 ? LIGHT_BLUE : LIGHT_GRAY

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
        Wait {moment.duration(timeToRestart * 1000).humanize()}
      </Text>
    );
  }

  renderFooter () {
    const { userHasInteracted } = this.state
    const { isActive, curChat, date } = this.props
    let footerComp = this.renderTapBelow
    let waitingToRestart = false

    const isTerminated = isActive && curChat.terminate.isTerminated
    if (isActive && isTerminated) {
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
      return (<View></View>)
    }
  }

  renderInputToolbar() {
    const { curChat, date } = this.props

    let renderInputContent = this.renderNextBubble
    if (curChat && curChat.atBranch) {
      renderInputContent = this.renderBranchOptions
    } else if (curChat && shouldWait(curChat, date)) {
      renderInputContent = this.renderWaitingBubble
    } else if (curChat && curChat.terminate.isTerminated) {
      renderInputContent = this.renderTerminatedBubble
    }

    return (
      <View style={styles.inputToolbar}>
        {renderInputContent()}
      </View>
    )
  }

  renderBranchOptions = () => {
    const { curChat, match } = this.props
    const currentThread = match.threads[curChat.thread]
    const { branch } = currentThread
    const { options } = branch

    return this.renderOptionBubbles(options)
  }

  renderOptionBubbles(options) {
    return options.map((option) => {
      { return this.renderOptionBubble(option) }
    })
  }

  renderOptionBubble(option) {
    const backgroundStyle = getBackgroundStyle(this.props.platform)

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
          <Text style={styles.endText}>
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
    const { curChat } = this.props
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
    const { giftedChat } = curChat
    const { messages } = giftedChat

    if (curChat.terminate.isTerminated) {
      PushNotification.requestPermissions()
    }

    const hasNewMessage = this.state.messages.length !== messages.length
    if (hasNewMessage) {
      this.setState({
        messages: GiftedChat.append(this.state.messages, messages[messages.length - 1]),
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
    let first_name = "Ann"
    if (isActive) {
      const char = characters.find((cha) => { return cha.key === curChat.key})
      first_name = char && char.first_name
    }

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
  waitBubble: {
    backgroundColor: LIGHT_GRAY
  },
  endBubble: {
    backgroundColor: '#888'
  },
  endText: {
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

const mapStateToProps = function(state) {
  const { activeChats, characters, currentChat, date } = state
  const { key } = currentChat

  const match = getMatch(state, key)
  const curChat = activeChats[key]
  const isActive = !_.isEmpty(curChat)
  const platform = match && match.threads[curChat.thread].platform || 'tinder'

  return {
    characters,
    curChat,
    date,
    isActive,
    key,
    match,
    platform
  }
}

reactMixin(Chat.prototype, timerMixin)

export default connect(mapStateToProps)(Chat)
