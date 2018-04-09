import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import { openCamera } from './helpers';
import Colors from '../constants/Colors';


const {width} = Dimensions.get("window");

export default class CameraScreen extends Component {
    t;

    constructor(props) {
        super(props);

        this.state = {
            progress: 0
        };

        this.t = setInterval(this.incrementProgress, 100);
    }

    incrementProgress() {
        this.setState({progress: this.state.progress + 0.10});
    }

    componentDidMount() {
        this.setState({progress: 1});
        clearInterval(this.t);
        //openCamera(() => {});
    }

    render() {
        return (
            <View style={{flex: 1, background: '#fff', justifyContent: 'center'}}>
                <Progress.Circle size={44} animated={true} progress={this.state.progress} color={Colors.main} thickness={3}
                    style={{marginLeft: width/2 - 22}}/>
            </View>
        );
    }
}