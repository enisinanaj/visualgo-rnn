/**
 * Created by ggoma on 12/21/16.
 */
import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default () => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBarContainer}>

                    <View style={styles.menuIcon}>
                        <Ionicons name='ios-search' color='#61636B' size={24} />
                    </View>
                    <View style={styles.searchIcon}>
                        <Ionicons name='ios-search' color='#61636B' size={24} />
                    </View>
                    <TextInput style={styles.search} placeholderTextColor={'#61636B'} placeholder={"Search"}/>
                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        padding: 12,

    },

    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },


    searchContainer: {
        height: 28,
        flexDirection: 'row'
    },

    search: {
        flex: 1,
        backgroundColor: '#00000020',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        fontSize: 16,
        color: 'black',
        borderRadius: 5,
    },

    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: '#00000000',
        borderRadius: 5,
        padding: 8,
    },

    menuIcon:{

    },

    searchIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
    },

})