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

const {width, height} = Dimensions.get('window');
const backgroundColorsArray = ['#6923b6', '#7c71de', 
                               '#f7d6f0', '#0e3efb', '#d8b96a',
                               '#c32ebd', '#e488f1', '#3f075d',
                               '#198ab8', '#70d384'];

// import {Font, AppLoading} from 'expo';
import Colors from '../../constants/Colors';
import nodeEmoji from 'node-emoji';
import PropTypes from 'prop-types';

export default class NoOpModal extends Component {
  static propTypes = {
    featureName: PropTypes.string.isRequired,
  };

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

  render() {
      // if (!this.state.isReady) {
      //   return <AppLoading />;
      // }

      return <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <TouchableHighlight
          style={styles.container}
          onPress={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
            <View style={styles.modal}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={styles.headText}>
                  {this.props.featureName} Feature will be available soon!
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                <Text style={styles.largeText}>
                  Stay Tuned!
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 30}}>
                  <Text style={[styles.headText, {marginTop: 0, width: null}]}>Made with {nodeEmoji.get('heart_eyes')} by </Text>
                  <Image source={require("../../assets/images/WARDA2.png")} style={styles.imageStyle} />
                </View>
              </View>
            </View>
        </TouchableHighlight>
      </Modal>;
  }
}

const styles = StyleSheet.create({
  container: {marginTop: 0, backgroundColor: 'rgba(0,0,0, 0.3)', flex: 1, flexDirection: 'row', justifyContent: 'center', height: height, width: width},
  modal: {marginTop: 150, height: 300, backgroundColor: Colors.white, borderRadius: 15, flex: 1, justifyContent: 'center', marginLeft: 20, marginRight: 20},
  headText: {marginTop: 30, textAlign: 'center', color: Colors.main, fontFamily: 'roboto-light', fontSize: 20, width: 200},
  largeText: {marginTop: 15, textAlign: 'center', color: Colors.main, fontFamily: 'roboto-light', fontSize: 40},
  imageStyle: {height: 15, width: 72.58, marginTop: 7.5, marginLeft: 3}
});