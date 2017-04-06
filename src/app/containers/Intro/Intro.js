import React, { Component } from 'react'
import { AppRegistry, Alert } from 'react-native'
import AppIntro from 'react-native-app-intro'
import { connect } from 'react-redux'

import { introFinished } from '../../actions/intro'
import { LIGHT_BLUE, TINDER_COLOR } from '../../lib/colors'

class Intro extends Component {
  pushMatches = () => {
    const { dispatch, navigator } = this.props
    dispatch(introFinished())
    navigator.push({
      title: 'Matches'
    })
  }

  onSkipBtnHandle = (index) => {
    this.pushMatches()
  }

  doneBtnHandle = () => {
    this.pushMatches()
  }

  render() {
    const pageArray = [{
      description: 'Learn fliratious and respectful online conversation through real chat stories.',
      img: require('./onboarding1.png'),
      imgStyle: {
        height: 156 / 2,
        width: 528 / 2
      },
      backgroundColor: TINDER_COLOR,
      fontColor: '#fff',
      level: 10,
    }, {
      description: 'Jump into one of our chat stories and "choose your own ending"',
      img: require('./onboarding2.png'),
      imgStyle: {
        height: 508 / 2.5,
        width: 499 / 2.5
      },
      backgroundColor: LIGHT_BLUE,
      fontColor: '#fff',
      level: 10,
    }, {
      description: 'Get helpful tips and insight from our modern day romance specialist',
      img: require('./onboarding3.png'),
      imgStyle: {
        height: 310 / 2,
        width: 630 / 2,
      },
      backgroundColor: TINDER_COLOR,
      fontColor: '#fff',
      level: 10,
    }];
    return (
      <AppIntro
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
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
    paddingBottom: 0,
    height: 0
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  }
}

export default connect()(Intro)