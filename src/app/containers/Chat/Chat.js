
import React from 'react'
import {
  Alert,
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

import { BABY_BLUE, LIGHT_GRAY, LIGHT_PURPLE, getBackgroundStyle, getBackgroundColor } from '../../lib/colors'
import {
  getMatch,
  initActiveChat,
  finishChat,
  getCurrentMessage,
  getNextMessage,
  getNextNextMessage,
  hasJumped,
  hasLongWait,
  isAtFirstMessage,
  isAtLastMessage,
  isCurrentlyWaiting,
  isTerminated,
  isUserOrNarrator,
  jumpUseTry,
  nextStep,
  switchBranchPushMessage,
  shouldWaitForMessage,
  shouldWaitForTerminate,
  waitMessageTimeLeft
} from '../../actions/chat'

import {
  characterSwitch
} from '../../actions/character'

import {
  notifInformUsersOnJumps
} from '../../actions/ui'

import {
  dateNow
} from '../../actions/date'

import NavTitle from '../Matches/NavTitle'
import BackButton from '../../components/Nav/BackButton'
import { ChatModal, StoreModal } from '../../components/Modal/Modal'
import Confetti from '../../modules/react-native-confetti'

const NEXT = 'NEXT'
const OPTIONS = 'OPTIONS'
const WAIT_SHORT = 'WAIT_SHORT'
const WAIT_LONG = 'WAIT_LONG'
const JUMP_LINE = 'JUMP_LINE'
const JUMP_RESTART = 'JUMP_RESTART'
const TRY_AGAIN = 'TRY_AGAIN'
const BACK = 'BACK'

const TEXT_COLOR_LIGHT = 'white'

const tryAlertInformJumps = (ui, curInput, dispatch) => {
  const jumps = [JUMP_LINE, JUMP_RESTART]
  if (!ui.notif_inform_users_on_jumps && jumps.includes(curInput)) {
    Alert.alert(
      `You'll need to subscribe!`,
      'Wing Unlimited allows you to have all the matches now and to never wait.'
    )
    dispatch(notifInformUsersOnJumps())
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      animatedStartValue: new Animated.Value(0),
      userHasInteracted: false,
      buttonsDisabled: false,
      modalChatOpen: false,
      modalStoreOpen: false
    }
  }

  _onOpenModalChat() {
    this.setState({
      modalChatOpen: true
    })
  }

  _onCloseModalChat() {
    this.setState({
      modalChatOpen: false
    })
  }

  _onOpenModalStore() {
    this.setState({
      modalStoreOpen: true
    })
  }

  _onCloseModalStore() {
    this.setState({
      modalStoreOpen: false
    })
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

  _onPressAvatar(usr) {
    const { dispatch, navigator } = this.props
    const { _id } = usr
    dispatch(characterSwitch(_id))
    navigator.push({
      title: 'Profile'
    })
  }

  _onPressTitle(char) {
    const { dispatch, navigator } = this.props
    const { cha_id } = char
    dispatch(characterSwitch(cha_id))
    navigator.push({
      title: 'Profile'
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

  renderWaitingFooter(footerText) {
    return (
      <Text style={styles.footerText}>
        {footerText}
      </Text>
    );
  }

  renderFooter () {
    const { userHasInteracted } = this.state
    const { curChat, curInput, curThread, date, jumpable, isTerm } = this.props
    let footerComp = this.renderTapBelow
    let waitingToRestart = false

    const waits = [WAIT_LONG, JUMP_LINE, JUMP_RESTART]
    const messageWaits = [WAIT_LONG, JUMP_LINE]

    if (waits.includes(curInput)) {
      let timeLeft = 0
      if (messageWaits.includes(curInput)) {
        timeLeft = waitMessageTimeLeft(curChat, curThread, date)
      } else {
        const dNow = dateNow()
        const { dateRetry } = curChat.terminate
        waitingToRestart = dateRetry > dNow
        timeLeft = dateRetry - dNow
      }

      let footerText = `Wait ${moment.duration(timeLeft * 1000).humanize()}`

      if (curInput === JUMP_LINE) {
        footerText += " or..."
      }

      if (curInput === JUMP_RESTART) {
        footerText += " to retry, or..."
      }
      footerComp = this.renderWaitingFooter.bind(this, footerText)
    }

    if (!userHasInteracted || waits.includes(curInput)) {
      this.setTimeout(
        () => {this.cycleFooterAnimation(); },
        500
      )
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
      return (<View><Animated.View style={[styles.footer]} /><Text></Text></View>)
    }
  }

  getInput = (curInput) => {
    switch(curInput) {
      case NEXT:
        return this.renderNextBubble
      case OPTIONS:
        return this.renderBranchOptions
      case JUMP_LINE:
        return this.renderSubscribeBubble
      case JUMP_RESTART:
        return this.renderSubscribeBubble
      case TRY_AGAIN:
        return this.renderTerminatedBubble
      case WAIT_SHORT:
        return this.renderWaitingBubble
      case WAIT_LONG:
        return this.renderWaitingBubble
      case BACK:
        return this.renderBackBubble
      default:
        return this.renderNextBubble
    }
  }

  renderInputToolbar() {
    const { curChat, curInput } = this.props
    const { key } = curChat

    return (
      <View style={styles.inputToolbar}>
        {this.getInput(curInput)(key)}
      </View>
    )
  }

  renderBranchOptions = () => {
    const { curChat, curThread } = this.props
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
        <View style={[styles.bubbleBase, styles.optionBubble, backgroundStyle]}>
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

  renderJumpRestartBubble = (key) => {
    const text = "Use a Skip to Restart"
    return this.renderJumpBubble(key, text)
  }

  renderJumpLineBubble = (key) => {
    const text = "Use a Skip to fast forward"
    return this.renderJumpBubble(key, text)
  }

  renderJumpBubble = (key, text) => {
    return (
      <TouchableOpacity onPress={this._onJumpPress.bind(this, key)}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.longWaitBubble]}>
          <Text style={styles.whiteText}>
            {text}
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

  renderBackBubble = () => {
    return (
      <TouchableOpacity onPress={this._onBackPress.bind(this)}>
        <View style={[styles.bubbleBase, styles.centerBubble, styles.waitBubble]}>
          <Text>
            Back
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderSubscribeBubble = () => {
    const backgroundStyle = getBackgroundStyle(this.props.platform)

    return (
      <TouchableOpacity onPress={this._onOpenModalStore.bind(this)}>
        <View style={[styles.bubbleBase, styles.centerBubble, backgroundStyle]}>
          <Text style={styles.whiteText}>
            Subscribe
          </Text>
        </View>
      </TouchableOpacity>
    )
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
    const { curChat, curInput, dispatch, isTerm, terminal_options, ui } = nextProps
    const { terminal_type } = terminal_options

    this.setState({
      buttonsDisabled: false
    })

    if (!curChat) return

    tryAlertInformJumps(ui, curInput, dispatch)

    const { giftedChat } = curChat
    const { messages } = giftedChat

    const hasNewMessage = this.state.messages.length !== messages.length
    if (hasNewMessage) {
      this.setState({
        messages: GiftedChat.append(this.state.messages, messages[messages.length - 1])
      })
    }

    if (isTerm) {
      const { key } = curChat
      if (!curChat.terminate.showedEndingSeq) {
        this._onOpenModalChat()
        if(this._confettiView && terminal_type === 'success') {
          this._confettiView.startConfetti();
        }
        dispatch(finishChat(key))
      } else {
        this._onCloseModalChat()
      }
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
  }

  componentWillUnmount() {
    if (this._confettiView) {
      this._confettiView.stopConfettiAnimation()
    }
  }

  render() {
    const { characters, curChat, curThread, isActive, terminal_options } = this.props
    if (!isActive) {
      return (<View><Text>...</Text></View>)
    }

    const char = characters.find((cha) => { return cha.key === curChat.key})
    const first_name = char && char.first_name
    const { terminal_type, text } = terminal_options

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<BackButton onBackPress={this._onBackPress.bind(this)} />}
          tintColor={"#F8F8F8"}
          title={<NavTitle character={char} onPress={this._onPressTitle.bind(this, char)} />}
        />
        <GiftedChat
          onPressAvatar={this._onPressAvatar.bind(this)}
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
        <ChatModal
          type={terminal_type}
          open={this.state.modalChatOpen}
          close={this._onCloseModalChat.bind(this)}
          text={text}
        />
        <StoreModal
          open={this.state.modalStoreOpen}
          close={this._onCloseModalStore.bind(this)}
          onClosed={this._onCloseModalStore.bind(this)}
        />
        <Confetti ref={(node) => this._confettiView = node}/>
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

const getCurrentInput = function(curChat, curThread, date, isSubscribed, isTerm, jumpable) {
  if (curChat.atBranch) return OPTIONS
  if (isTerm) {
    if (isSubscribed) return TRY_AGAIN
    if (shouldWaitForTerminate(curChat, date) && !hasJumped(curChat)) {
      if (jumpable) {
        return JUMP_RESTART
      } else {
        return BACK
      }
    }
    return TRY_AGAIN
  }

  if (isAtFirstMessage(curChat)) return NEXT

  const nextMessage = getNextMessage(curChat, curThread)

  // WORLD OF WAITING AND LINE JUMPS, nothing to do with termination
  if (isCurrentlyWaiting(curChat)) return WAIT_SHORT
  if (isSubscribed) return NEXT

  if (nextMessage && hasLongWait(nextMessage) && shouldWaitForMessage(curChat, curThread, date)) {
    if (curThread.branch.branch_type === 'terminal' && !isAtLastMessage(curChat, curThread)) return JUMP_LINE
    if (jumpable) {
      return JUMP_LINE
    } else {
      return WAIT_LONG
    }
  }

  return NEXT
}

const mapStateToProps = function(state) {
  const { activeChats, characters, currentChat, date, inventory, ui } = state
  const { key } = currentChat

  const match = getMatch(state, key)
  const curChat = activeChats[key]
  const isActive = !_.isEmpty(curChat)
  const jumpable = match && match.options.jumpable
  const platform = match && match.threads[curChat.thread].platform
  const isSubscribed = inventory.subscription.enabled
  let curInput, curThread
  let isTerm = false
  let terminal_options = {}

  if (isActive) {
    curThread = match.threads[curChat.thread]
    isTerm = isTerminated(curChat)
    curInput = getCurrentInput(curChat, curThread, date, isSubscribed, isTerm, jumpable)
    terminal_options = curThread.branch.terminal_options
  }

  return {
    characters,
    curChat,
    curInput,
    curThread,
    date,
    isActive,
    isSubscribed,
    isTerm,
    key,
    match,
    platform,
    terminal_options,
    ui
  }
}

reactMixin(Chat.prototype, timerMixin)

export default connect(mapStateToProps)(Chat)
