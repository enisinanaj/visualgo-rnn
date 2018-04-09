import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    Platform,
    Modal
} from 'react-native';

// import {Font, AppLoading} from 'expo';
import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import DefaultRow from './default-row';
import NoOpModal from './NoOpModal';
import DisabledStyle from '../../constants/DisabledStyle';

const {width, height} = Dimensions.get('window');

export default class ContextualActionsMenu extends Component {
  static propTypes = {
    buttons: PropTypes.array.isRequired
  };

  noOpModals = [];

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      isReady: false
    };   
  }

  componentDidMount() {
    this.loadFonts()
  }

  async loadFonts() {
    // await Font.loadAsync({
    //   'roboto-light': '../../assets/fonts/Roboto-Light.ttf'
    // });

    this.setState({isReady: true});
  }

  toggleState() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  renderMenuElement(button, index) {
    if (button.disabled) {
        button.onPress = () => this[index].toggleState()
    }

    return <DefaultRow key={index} style={{backgroundColor: 'transparent'}}>
            {!button.advanced ?
                <TouchableOpacity style={[{flexDirection: 'row', justifyContent: 'flex-start'}, button.disabled ? DisabledStyle.disabled : {}]}
                    onPress={() => button.onPress()}>
                    <Image source={button.image} style={styles.menuIcon} resizeMode={"center"} />
                    <Text style={[styles.menuElement, button.disabled ? DisabledStyle.textDisabled : {}]}>{button.title}</Text>
                    {button.disabled ?
                    <NoOpModal featureName={button.featureName ? button.featureName : button.title} ref={(noOpModal) => this[index] = noOpModal} />
                    : null}
                </TouchableOpacity>
                :
                button.renderContent()}
            </DefaultRow>
              
  }

  render() {
      // if (!this.state.isReady) {
      //   return <AppLoading />;
      // }

      return <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {this.setState({modalVisible: false})}}>
        <TouchableOpacity style={styles.container} onPress={() => {this.setState({modalVisible: false})}}>
            <View style={styles.actionsList}>
                {this.props.buttons.map((b, i) => {
                    return this.renderMenuElement(b, i)
                })}
            </View>
        </TouchableOpacity>
      </Modal>;
  }
}

const styles = StyleSheet.create({
  container: {
      marginTop: 0,
      backgroundColor: 'rgba(0,0,0, 0.3)',
      height: height,
      width: width,
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 1
  },
  actionsList: {
      bottom: 0,
      height: null,
      width: width,
      position: 'absolute',
      backgroundColor: Colors.white,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      flex: 1,
      justifyContent: 'center',
      marginLeft: 0,
      marginRight: 0
    },
    menuElement: {
      backgroundColor: 'transparent',
      color: Colors.black,
      fontFamily: 'roboto-light',
      fontSize: 16
    },
    menuIcon: {
        marginTop: 1,
        marginRight: 13,
        marginLeft: 10,
        width: 18,
        height: 18,
    }
});