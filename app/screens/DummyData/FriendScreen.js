import { Image, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../../constant';
import { Applogo } from '../../components/global';
import filter from "lodash.filter"
import Icon, { Icons } from '../../components/Icons';
import Font from '../../config/CustomFont';

const FriendScreen = () => {

    const isFocused = useIsFocused();
    const API_END = 'https://fakestoreapi.com/products'
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);

    // const [filteredData, setFilteredData] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setIsData] = useState([]);
    const [fullData, setIsFullData] = useState([]);

    const [error, setIsError] = useState(null);

    const searchRef = useRef();

    useEffect(() => {
        setIsLoading(true);
        fethData('https://randomuser.me/api/?results=50');
    }, []);

    const fethData = async (url) => {

        try {
            const response = await fetch(url);
            const json = await response.json();

            setIsData(json.results);
            setUsers(json.results);
            setIsFullData(json.results)
            setIsLoading(false);

        } catch (err) {
            setIsError(err);

            setIsLoading(false);
        }
    }
    const handleSearch = (query) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();

        const filteredData = filter(fullData, (user) => {
            return contains(user, formattedQuery);
        });
        setIsData(filteredData);

    }
    const contains = ({ name, email }, query) => {
        const { first, last } = name;
        if (
            first.includes(query) ||
            last.includes(query) ||
            email.includes(query)) {
            return true
        }
        return false
    }
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={'#5500dd'} />
            </View>
        )
    }
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error in fetching data.... Please check your internet connection</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ width: '100%', padding: 20, backgroundColor: COLORS.primary }}>

                <View style={styles.searchBox}>
                    <Icon name={'search-outline'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                    <TextInput
                        ref={searchRef}
                        style={{
                            paddingVertical: 0,
                            flex: 1,
                            color: COLORS.titleColor,
                            fontFamily: Font.RalewayRegular,
                            fontSize: 15,
                            letterSpacing: 1.2
                        }}
                        placeholder='Search'
                        //clearButtonMode='always'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={searchQuery}
                        onChangeText={(query) =>
                            handleSearch(query)


                        }
                    />
                    {
                        searchQuery == '' ? null : <TouchableOpacity onPress={() => {
                            searchRef.current.clear();
                            setSearchQuery('');
                            setIsData(fullData);
                        }
                        }>
                            <Icon name={'close-circle'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                        </TouchableOpacity>
                    }

                </View>

            </View>
            {
                <FlatList
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <View style={styles.friendContainer}>
                            <Image
                                source={{ uri: item.picture.large }}
                                style={styles.image}
                            />
                            <View>
                                <Text style={styles.textName}>{item.name.first} {item.name.last}</Text>
                                <Text style={styles.textEmail}>{item.email}</Text>
                            </View>
                        </View>
                    }
                    ListHeaderComponent={
                        <View>
                            <Text style={styles.textFiends}>Friends</Text>
                        </View>
                    }
                />
                
            }
        </SafeAreaView>
    )
}

export default FriendScreen

const styles = StyleSheet.create({
    textFiends: {

        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10,
        fontWeight: 'bold',
        marginTop: 10
    },
    friendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,

    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: '600'
    },
    textEmail: {
        fontSize: 14,
        marginLeft: 10,
        color: 'grey'
    },
    searchBox: {

        backgroundColor: COLORS.textBgcolor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: COLORS.textBgcolor,
        borderWidth: 1,
        borderRadius: 8,

    },
})
/**
 *   const searchFilterFunction = (text) => {

        console.log('filteredData:- ', filteredData.length);

        if (text) {
            const newData = filteredData.filter(item => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setItems(newData);
        }
        else {
            setItems(filteredData);
        }


    function handleFilter(searchTerm) {
        console.log('user', searchTerm);
        setUsers(users.filter((user) =>
            user.email.toUpperCase().includes(searchTerm.toUpperCase())
        ))
    }
    const searchFilterFunction = (text) => {


        if (text) {
            const newData = data.filter(item => {
                const itemData = item.name.first ? item.name.first.toUppercase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredData(newData);
        }
        else {

            setFilteredData(data);
        }



    }
    function myFilterFunction(txt) {
        if (txt == '') {
            setIsData(fullData)
        }
        else {
            let tempList = data.filter(item => {
                return item.name.first.toLowerCase().indexOf(txt.toLowerCase()) > -1
            })
            setIsData(tempList)
        }

    }
    }
 */