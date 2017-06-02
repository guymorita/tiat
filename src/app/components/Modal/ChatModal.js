
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Modal from 'react-native-modalbox'
import { TINDER_COLOR, SUCCESS_GREEN } from '../../lib/colors'

export default class ChatModal extends React.Component {
  render() {
    const { open, text, type } = this.props

    const success = type === "success";

    const addnStyle = success ? styles.success : styles.fail
    const title = success ? "Great!" : "Oops!"
    const imgMap = {
      'success': require('./success.png'),
      'fail': require('./fail.png')
    };
    const img = imgMap[type]

    return (
      <Modal
        style={[styles.modal, styles.modal3]}
        position={"center"}
        backdrop={true}
        backdropOpacity={0.3}
        backdropPressToClose={true}
        isOpen={open}
        ref={"modal"}
      >
        <View style={styles.container}>
          <View style={[styles.upper, addnStyle]}>
            <Image
              source={img}
              style={styles.sign}
            />
          </View>
          <View style={[styles.bottom]}>
            <Text style={styles.headerText}>
              {title}
            </Text>
            <Text>
              {text}
            </Text>
          </View>
        </View>
      </Modal>
    )
  }
}

const MODAL_EDGE_LENGTH = 300


const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal3: {
    width: MODAL_EDGE_LENGTH,
    height: MODAL_EDGE_LENGTH
  },

  container: {
    flex: 1,
    flexDirection: 'column'
  },

  upper: {
    width: MODAL_EDGE_LENGTH,
    height: MODAL_EDGE_LENGTH * 0.55,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  success: {
    backgroundColor: SUCCESS_GREEN
  },

  fail: {
    backgroundColor: TINDER_COLOR
  },

  sign: {
    width: 75,
    height: 75
  },

  headerText: {
    fontSize: 24,
    marginBottom: 10
  }
})