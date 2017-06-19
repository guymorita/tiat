import React, { Component } from 'react'
import { AppRegistry, Alert } from 'react-native'
import AppIntro from 'react-native-app-intro'
import { connect } from 'react-redux'

import { introFinished } from '../../actions/ui'
import { LIGHT_BLUE, LIGHT_PURPLE, TINDER_COLOR } from '../../lib/colors'

class Intro extends Component {
  pushMatches = () => {
    const { dispatch, navigator } = this.props
    dispatch(introFinished())
    navigator.push({
      title: 'Matches'
    })
  }

  doneBtnHandle = () => {
    this.pushMatches()
  }

  render() {
    const pageArray = [{
      title: 'Master Ethical Flirting',
      description: 'Learn fliratious and respectful text conversation through real chat stories.',
      img: require('./onboarding1.png'),
      imgStyle: {
        height: 156 / 2,
        width: 528 / 2
      },
      backgroundColor: TINDER_COLOR,
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Choose Your Own Path',
      description: 'Will you choose to play it safe or take a little risk. Find out which works better!',
      img: require('./onboarding5.png'),
      imgStyle: {
        height: 350 / 1.5,
        width: 420 / 1.5
      },
      backgroundColor: LIGHT_BLUE,
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Get Instant Feedback',
      description: 'Get helpful tips and insight from our modern romance specialist',
      img: require('./onboarding3.png'),
      imgStyle: {
        height: 310 / 2.5,
        width: 630 / 2.5,
      },
      backgroundColor: LIGHT_PURPLE,
      fontColor: '#fff',
      level: 10,
    }];
    return (
      <AppIntro
        onDoneBtnClick={this.doneBtnHandle}
        showSkipButton={false}
        pageArray={pageArray}
        customStyles={customIntroStyles}
      />
    );
  }
}

const customIntroStyles = {
  info: {
    paddingTop: 0,
    alignItems: 'center'
  },
  header: {
    justifyContent: 'flex-end',
    marginBottom: 35
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500'
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  }
}

export default connect()(Intro)