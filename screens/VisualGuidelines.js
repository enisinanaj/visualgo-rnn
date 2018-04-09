/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    TouchableOpacity,
    Button
} from 'react-native';

import Drawer from 'react-native-drawer'

const {width, height} = Dimensions.get('window');

// import {Font, AppLoading} from 'expo';

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import VisualGuidelineItem from './common/visual-guideline-item';
import FilterBar from './common/filter-bar';
import CreateVisualGuideline from './common/create-visual-guideline';


import _ from 'lodash';
import Shadow from '../constants/Shadow';
import AppSettings, { getProfile } from './helpers/index';

//1 is regular post, 2 is image
const data = ['0'];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class VisualGuidelines extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            loading: false,
            opacity: new Animated.Value(1),
            header_height: new Animated.Value(96),
            dataSource: ds.cloneWithRows(data),
            take: 20,
            skip: 0,
            isReady: false,
            isAnimatingSearchBar: false,
            visualGuidelineModal: false
        };

        this._loadAlbums();

        this.offsetY = 0;
        this.offsetX = new Animated.Value(0);
        this.content_height = 0;
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 300);
    }

    componentDidMount() {
        this.loadFonts(() => {setTimeout(() => {this.measureView()}, 0)});
        
    }

    prepareVisualGuidelinesModal() {
        this.setState({visualGuidelineModal: true});
    }

    renderVisualGuidelinesModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.visualGuidelineModal}
                onRequestClose={() => this.finishNewVisualGuideline()}>
                
                <CreateVisualGuideline closeModal={() => this.finishNewVisualGuideline()}  />
            </Modal>
        );
    }

    async loadFonts(onLoaded) {
        // await Font.loadAsync({
        //     'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
        //     'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
        // });

        this.setState({isReady: true});
        onLoaded();
    }
 
    measureView() { 
        this.refs.view.measure((a, b, w, h, px, py) => { 
            this.content_height = h; 
        }); 
    } 

    _clearAlbums() {
        data = ['0'];
        this.setState({dataSource: ds.cloneWithRows(['0'])});
    }

    _loadAlbums(query) {

        var addQuery = query != undefined ? '&q=' + query : '';

        return fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getalbums')
            .then((response) => response.json())
            .then((responseJson) => {
                console.debug("albums response: " + responseJson);
                try {
                    var array = JSON.parse(responseJson)
                } catch (e) {
                    return Promise.reject(e)
                }
                
                var sorted = array.sort( (a,b) => (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0) )    

                return Promise.resolve(sorted);
            })
            .then((responseJson) => {
                let promises = []
                console.log('Number of tasks: ' + responseJson.length)
                responseJson.forEach(element => {
                    if (element.idcommentPost == null) {
                        this.setState({offset: this.state.offset + 1});

                        promises.push(new Promise((resolve, reject) => {
                            getProfile(element.taskout.post.idauthor, (responseJson) => {
                                element.profile = JSON.parse(responseJson);
                                resolve(element);
                            })
                        }))
                    }
                });

                if(promises.length) {
                    Promise.all(promises)
                    .then(response => {
                        data = data.concat(response)
                        this.setState({dataSource: ds.cloneWithRows(data), refreshing: false});
                    })
                    .finally(test => console.log("Finally rendered all tasks", test))
                    .catch(error => console.log(error))
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    finishNewVisualGuideline() {
        this.setState({visualGuidelineModal: false}, this._onRefresh);
    }

    _onRefresh() {
        this.setState({refreshing: true});
        setTimeout(() => {
            this._clearAlbums();
            this._loadAlbums();
        }, 1500)
    }

    _renderRow(data) {
        filters = [{title: 'New', active: true, onPress: () => this.prepareVisualGuidelinesModal()},
            {type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
            {title: '#San Valentino', selected: true, active: true}, 
            {title: '@Ambiente', active: true}, 
            {title: 'Task', active: true},
            {title: '#Sale', active: true}];
        if (data == '0') {
            return <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"Guideline"} />
                </View>;
        }

        if (data.theme.mediaUrl != undefined) {
            return <VisualGuidelineItem data={data} {...this.props}/>
        }

        return null;
    }

    loadMore() {
        this.setState({
            skip: this.state.skip + this.state.keep,
            loading: true
        });
        
        this._loadAlbums();
    }

    _onScroll(event) {
        const e = event.nativeEvent;
        const l_height = e.contentSize.height;
        const offset = e.contentOffset.y;

        if (!this.state.isAnimatingSearchBar) {
            if(offset >= this.offsetY) {
                if(offset - this.offsetY > 30) { 
                    this.setState({isAnimatingSearchBar: true});

                    setTimeout(() => {
                        AppSettings.appIndex.hideSearchBar();
                        this.setState({isAnimatingSearchBar: false})},
                    150); 
                } 
            } else if (offset + this.content_height != l_height) { 
                this.setState({isAnimatingSearchBar: true});
                setTimeout(() => {
                    AppSettings.appIndex.showSearchBar(); 
                    this.setState({isAnimatingSearchBar: false})},
                150);
            }
        }

        // this.offsetY = offset;
        // if(offset + this.content_height + 100 >= l_height) {
        //     this.loadMore();
        // }
    }

    getStyle() {
        return {
            opacity: this.offsetX.interpolate({
                inputRange: [0, width * 4/5],
                outputRange: [1, 0],
            }),
        }
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        return (
            <View ref='view' style={styles.container}>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    style={styles.listView}
                    onScroll={this._onScroll}
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this._renderRow(data)}
                />
                {this.renderVisualGuidelinesModal()}
            </View>
        )
    }
}

const drawerStyles = {
    drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 0},
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
        backgroundColor: "#f7f7f7"
    },
    fade: {
        height,
        backgroundColor: 'black',
        width: width * 4/5,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width,
        height: 100
    }
})