
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Modal from 'react-native-modalbox'
import { TINDER_COLOR } from '../../lib/colors'

export default class ChatModal extends React.Component {
  render() {
    const { open, type } = this.props

    const addnStyle = type === "success" ? styles.success : styles.fail

    return (
      <Modal
        style={[styles.modal, styles.modal3]}
        position={"center"}
        backdrop={true}
        backdropOpacity={0.3}
        isOpen={open}
        ref={"modal"}
      >
        <View style={styles.container}>
          <View style={[styles.upper, addnStyle]}>
            <Image
              source={require('./fail.png')}
              style={styles.sign}
            />
          </View>
          <View style={[styles.bottom]}>
            <Text>
              Sorry you failed
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
    backgroundColor: "green",
    width: MODAL_EDGE_LENGTH,
    height: MODAL_EDGE_LENGTH / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bottom: {
    alignItems: 'center'
  },

  success: {
    backgroundColor: "green"
  },

  fail: {
    backgroundColor: TINDER_COLOR
  },

  sign: {
    width: 75,
    height: 75
  }
})