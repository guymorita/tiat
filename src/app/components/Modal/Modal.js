
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
import { ConStoreSections } from '../../containers/Store/Store'

const MODAL_WIDTH_LENGTH = 300
const MODAL_HEIGHT_LENGTH = 400

class BasicModal extends React.Component {
  render() {
    const { open } = this.props
    return (
      <Modal
        style={[styles.modal, styles.modal3]}
        position={"center"}
        backdrop={true}
        backdropOpacity={0.3}
        backdropPressToClose={true}
        isOpen={open}
        ref={"modal"}
        {...this.props}
      >
        <View>
          {React.cloneElement(this.props.children, {...this.props})}
        </View>
      </Modal>
    )
  }
}

export class StoreModal extends React.Component {
  render() {
    return (
      <BasicModal {...this.props}>
        <View style={styles.container}>
          <ConStoreSections MODAL_WIDTH_LENGTH={MODAL_WIDTH_LENGTH}/>
        </View>
      </BasicModal>
    )
  }
}

const randInArr = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export class ChatModal extends React.Component {
  render() {
    const { open, text, type } = this.props

    const success = type === "success";

    const addnStyle = success ? styles.success : styles.fail
    const failMessages = [
      "Oops!",
      "Oh no!"
    ]

    const successMessages = [
      "Well done!",
      "Great!",
      "Booyah!"
    ]

    const title = success ? randInArr(successMessages) : randInArr(failMessages)
    const imgMap = {
      'success': require('./success.png'),
      'fail': require('./fail.png')
    };
    const img = imgMap[type]

    return (
      <BasicModal {...this.props}>
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
            <Text style={styles.text}>
              {text}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this.props.close}>
                <View style={[styles.productButton, styles.redBackground]}>
                  <Text style={styles.productButtonText}>
                    ✗ Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BasicModal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal3: {
    width: MODAL_WIDTH_LENGTH,
    height: MODAL_HEIGHT_LENGTH
  },

  container: {
    flex: 1,
    flexDirection: 'column'
  },

  upper: {
    width: MODAL_WIDTH_LENGTH,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20
  },

  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: -1,
    padding: 20
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
    marginBottom: 10,
    fontWeight: '500',
    color: '#333'
  },
  text: {
    color: '#333'
  },
  buttonContainer: {
    bottom: 0
  },
  redBackground: {
    backgroundColor: TINDER_COLOR
  },
  productButton: {
    margin: 16,
    marginBottom: 20,
    borderRadius: 12,
    height: 45,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productButtonText: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '500'
  }
})
