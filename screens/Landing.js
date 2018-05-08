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

const {width, height} = Dimensions.get('window');

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import ButtonBar from './common/button-bar';
import OnYourMind from './common/onYourMind';
import NewsFeedItem from './common/newsfeed-item';
import TaskFeedItem from './common/taskfeed-item';
import CreatePost from './common/create-post';
import CreateTask from './common/create-task'; 
import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';

import {withNavigation} from 'react-navigation';

import _ from 'lodash';
import Shadow from '../constants/Shadow';
import AppSettings, { makeCancelable } from './helpers/index';
import ApplicationConfig from './helpers/appconfig';

var data = ['0', '1'];
var dataTasks = ['0', '1'];

const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'Survey', active: true, disabled: true}, 
    {title: 'Post', active: true, selected: false}, 
    {title: 'Task', selected: true, active: true},
    {title: '#San Valentino', active: true, selected: false}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Landing extends Component {
    cancelablePostPromise;
    cancelableTaskPromise;

    constructor(props) {
        super(props);

        this.state = {
            modalPost: false,
            modalTask: false,
            refreshing: false,
            loading: false,
            opacity: new Animated.Value(1),
            header_height: new Animated.Value(96),
            dataSource: ds.cloneWithRows(data),
            dataSourceTasks: ds.cloneWithRows(dataTasks),
            take: 20,
            skip: 0,
            offset: 0,
            isReady: false,
            isAnimatingSearchBar: false,
            selectType: 'tasks'
        };

        filters[0].onType = (query) => {this._clearPosts(); this._loadPosts(query);};

        if (false) {
            this._loadPosts();
        } else {
            this._loadTasks();
        }

        this.offsetY = 0;
        this.offsetX = new Animated.Value(0);
        this.content_height = 0;
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 300);
    }

    componentDidMount() {
        setTimeout(() => {this.measureView()}, 0);

        for (i in filters) {
            if (filters[i].title == 'Survey') {
                filters[i].onPress = () => this._noOpSurveyInFilter.toggleState();
            }

            if (filters[i].title == 'Post') {
                filters[i].onPress = () => {
                    this.setState({selectType: 'posts'});
                    this.resetDatasource({reload: true});
                }
            }

            if (filters[i].title == 'Task') {
                filters[i].onPress = () => {
                    this.setState({selectType: 'tasks'});
                    this.resetDatasource({reload: true});
                }
            }
        }
        
        ApplicationConfig.getInstance().tabNavigator = this.props.navigation;
    }

    async loadFonts(onLoaded) {
        this.setState({isReady: true});
        onLoaded();
    }
 
    measureView() { 
        this.refs.view.measure((a, b, w, h, px, py) => { 
            this.content_height = h; 
        }); 
    } 

    _clearPosts() {
        data = ['0', '1'];

        if (this.cancelablePostPromise) {
            this.setState({loading: false}, () => this.cancelablePostPromise.cancel());
        }

        this.setState({dataSource: ds.cloneWithRows(data), offset: 0}, () => {
            if (this.state.selectType == 'posts') {
                this._loadPosts();
            }
        });
    }

    _loadPosts(query) {
        var addQuery = query != undefined ? '&q=' + query : '';

        this.cancelablePostPromise = makeCancelable(
            new Promise(r => {
                if (this.state.loading) {
                    return Promise.reject("already loading...")
                }

                this.setState({loading: true});
                fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/posts/getposts?pagesize=1000&pageindex=' + this.state.offset + '&iduser=' + ApplicationConfig.getInstance().me.id + addQuery)
                .then((response) => {return response.json()})
                .then((response) => {
                    try {
                        var array = JSON.parse(response)
                    } catch (e) {
                        return Promise.reject(e)
                    }
                    
                    var sorted = array.sort( (a,b) => (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0) )    

                    return Promise.resolve(sorted);
                })
                .then((responseJson) => {
                    responseJson.forEach(element => {
                        if (element.idcommentPost == null) {
                            this.setState({offset: this.state.offset + 1});
                            element.isPost = true;
                        }
                    });

                    return responseJson;
                })
                .then(response => {
                    data = data.concat(response);
                    this.setState({dataSource: ds.cloneWithRows(data), refreshing: false})
                    return response.length
                })
                .finally(result => {
                    this.setState({loading: false});
                })
                .catch((error) => {
                    console.error(error);
                });
            })
          );
          
          this.cancelablePostPromise
            .promise
            .catch((reason) => console.log('isCanceled', reason.isCanceled));
    }

    _clearTasks() {
        dataTasks = ['0', '1'];

        if (this.cancelableTaskPromise) {
            this.setState({loading: false}, () => this.cancelableTaskPromise.cancel());
        }

        this.setState({dataSourceTasks: ds.cloneWithRows(dataTasks), offset: 0}, () => {
            if (this.state.selectType == 'tasks') { 
                this._loadTasks();
            }
        });
    }

    _loadTasks(query) {
        var addQuery = query != undefined ? '&q=' + query : '';

        this.cancelableTaskPromise = makeCancelable(
            new Promise(r => {
                if (this.state.loading) {
                    return Promise.reject("already loading...")
                }

                this.setState({laoding: true});

                fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gettasks?elementsno=100&fromindex=' + this.state.offset + '&iduser=' + ApplicationConfig.getInstance().me.id + addQuery)
                .then((response) => {return response.json()})
                .then((response) => {
                    try {
                        var array = JSON.parse(response)
                    } catch (e) {
                        return Promise.reject(e)
                    }
                    
                    var sorted = array.sort( (a,b) => (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0) )    

                    return Promise.resolve(sorted);
                })
                .then((responseJson) => {
                    responseJson.forEach(element => {
                        if (element.idcommentPost == null) {
                            this.setState({offset: this.state.offset + 1});
                            element.isTask = true;
                        }
                    });

                    dataTasks = dataTasks.concat(responseJson);
                    this.setState({dataSourceTasks: ds.cloneWithRows(dataTasks), refreshing: false})
                    return responseJson;
                })
                .catch((error) => {
                    console.error(error);
                });
            })
        );

        this.cancelableTaskPromise
            .promise
            .then(() => console.log('resolved'))
            .catch((reason) => console.log('isCanceled', reason.isCanceled));
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.resetDatasource();
    }

    _renderRow(data, sectionID, rowID, highlightRow) {
        if (data == '0') {
            return <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"My Wall"} />
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurveyInFilter = noOpModal} />
                </View>;
        } else if (data == '1') {
            let buttons = [
                {title: 'Task', onPress: () => this.setState({modalTask: true})}, 
                {title: 'Post', onPress: () => this.setState({modalPost: true})},
                {title: 'Survey', onPress: () => this._noOpSurvey.toggleState(), noOp: true}];

            if (ApplicationConfig.getInstance().isSM()) {
                buttons.splice(0, 1);
            }

            return (
                <View style={[styles.onYourMindContainer, Shadow.cardShadow]}>
                    <OnYourMind onFocus={() => this.setState({modalPost: true})}/>
                    <ButtonBar ref='buttonBar' buttons={buttons}/>
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurvey = noOpModal} />
                </View>
            )
        }

        return (
            <View>
                {data.isTask ? <TaskFeedItem data={data}/> : null}
                {data.isPost ? <NewsFeedItem data={data} onBack={()=>this.resetDatasource()}/> : null}
            </View>
        )
    }

    resetDatasource(obj) {
        this._clearPosts();
        this._clearTasks();

        this.setState({modalPost: false, modalTask: false});
    }

    _handleTypeChange(t) {
        if (t == 'post') {
            this.setState({
                modalTask: false,
                modalPost: true
            });
        } else if (t == 'task') {
            this.setState({
                modalPost: false,
                modalTask: true,
            });
        }
    }

    renderModal() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalPost}
                    onRequestClose={() => this.setState({modalPost: false})}>
                    <CreatePost closeModal={(obj) => this.resetDatasource(obj)} navigator={this.props.navigator} 
                        handleTypeChange={(t) => this._handleTypeChange(t)}/>
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalTask}
                    onRequestClose={() => this.setState({modalTask: false})}>
                    <CreateTask closeModal={(obj) => this.resetDatasource(obj)} 
                        handleTypeChange={(t) => this._handleTypeChange(t)}/>
                </Modal>
            </View>
        )
    }

    loadMore() {
        if (this.state.selectType == 'posts') {
            this._loadPosts();
        } else if (this.state.selectType == 'tasks') {
            this._loadTasks();
        }
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
                        ApplicationConfig.getInstance().index.hideSearchBar();
                        this.setState({isAnimatingSearchBar: false})},
                    150); 
                } 
            } else if (offset + this.content_height != l_height) { 
                this.setState({isAnimatingSearchBar: true});
                setTimeout(() => {
                    ApplicationConfig.getInstance().index.showSearchBar(); 
                    this.setState({isAnimatingSearchBar: false})},
                150);
            }
        }

        this.offsetY = offset;
        if(offset + this.content_height + 100 >= l_height) {
            this.loadMore();
        }
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
        return (
            <View ref='view' style={styles.container}>
                {this.state.selectType == 'posts' ?
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
                : null}

                {this.state.selectType == 'tasks' ?
                    <ListView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        style={styles.listView}
                        onScroll={this._onScroll}
                        dataSource={this.state.dataSourceTasks}
                        renderRow={(data) => this._renderRow(data)}
                    />
                : null}
                {this.renderModal()}
            </View>
        )
    }
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
    onYourMindContainer: {
        marginTop: 6,
        marginBottom: 6,
        marginRight: 5,
        marginLeft: 5,
        padding: 0,
        borderRadius: 14,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width,
        height: 100
    }
});


export default withNavigation(Landing);