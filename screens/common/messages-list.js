/**
 * Created by ggoma on 12/21/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Dimensions,
    ListView,
    Text,
    StyleSheet,
    ScrollView,
    TouchableHighlight
} from 'react-native';

const {width, height} = Dimensions.get('window');
import Colors from '../../constants/Colors';
import SearchBar from './search-bar';
import DefaultRow from './default-row';
import FilterBar from './filter-bar';

const data = ['1', '1', '1', '1', '1', '1', '1', '1', '1','1', '1', '1','1', '1', '1'];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MessagesList extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: ds.cloneWithRows(data)
        }

    }

    onPress(){
        console.log("click");
    }

    renderFilters() {
        filters = ['0',
          {title: 'All', selected: false},
          {title: 'Group', selected: false},
          {title: 'Active', selected: false}];
        return <View style={styles.filterBarContainer}><FilterBar headTitle={"Messages"} data={filters} customStyle={{height: 100}} /></View>
      }

    _renderRow(data) {
        return (
            <View></View>
        );
    }

    render() {
        return (
            <View style={styles.drawer}>
                <SearchBar ref='searchBar' style={styles.searchBar}/>
                <DefaultRow renderChildren={() => this.renderFilters()} />

                <ScrollView
                    ref='scrollview'
                    bounces={false}
                    scrollEventThrottle={100}
                    showsHorizontalScrollIndicator={false}>

                    <ListView style={styles.chatBar}
                        dataSource={this.state.dataSource}
                        renderRow={(data) => this._renderRow(data)}/>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawer: {
        height,
        paddingTop: 0,
        width: width * 5/5,
        position: 'absolute',
        backgroundColor: Colors.white,
        right: 0
    },

    chatBar: {
        //paddingTop: 80
    },

    searchBar:{

    },

    filterButtons: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 17,
        paddingTop: 5,
        height: 44,
        color: Colors.main,
        marginLeft: (width - (width * 4.9/5)) / 2
    }
});