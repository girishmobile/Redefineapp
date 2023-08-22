import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useState } from 'react'
import Icon, { Icons } from '../components/Icons'
import { COLORS } from '../constant'
import Font from '../config/CustomFont'
import { useHeaderHeight } from '@react-navigation/elements';
import filter from 'lodash.filter';

const StoreModal = ({ visible, stores, onClose, onSelect, selectedStore = '' }) => {
    const headerHeight = useHeaderHeight();
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setIsData] = useState(stores);
    const [fullData, setIsFullData] = useState(stores);
    const closeModal = () => {
        onClose();
    }
    const Drawline = () => (
        <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.borderColor }}></View>
    );
    const onItemPress = (item) => {
        onSelect(item);
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
            <Text style={styles.dropDownTextStyle}>{item.label}</Text>
            {
                selectedStore.toUpperCase() === item.label.toUpperCase() && <Icon type={Icons.Ionicons} name={'checkbox-outline'} size={22} color={'rgba(99,102, 241, 1)'} />
            }
        </TouchableOpacity>
    );
    const handleSearch = (query) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, (user) => {
            return contains(user, formattedQuery);
        });
        setIsData(filteredData);
    }
    const contains = ({ label }, query) => {

        const value = label.toLowerCase();
        if (value.includes(query)) {
            return true
        }
        return false
    }
    return (
        <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={{ height: '100%', width: '100%', backgroundColor: '#fff', }}>
                <View style={{ height: headerHeight, justifyContent: 'flex-end', }}>
                    <View style={{ height: 44, paddingLeft: 20, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'center', fontFamily: Font.RalewaySemiBold, fontSize: 16, letterSpacing: 1.2, color: COLORS.lightText, }}>{'Store List'}</Text>
                        <TouchableOpacity onPress={() => closeModal()}>
                            <Icon type={Icons.Ionicons} name={'close-outline'} size={30} color={COLORS.lightText} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Drawline />
                <View style={{ width: '100%', padding: 10, backgroundColor: COLORS.primary }}>
                    <View style={styles.searchBox}>
                        <Icon name={'search-outline'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                        <TextInput
                            style={{
                                marginLeft: 0,
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

                                setSearchQuery('');
                                setIsData(fullData);
                            }
                            }>
                                <Icon name={'close-circle'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                            </TouchableOpacity>
                        }

                    </View>
                </View>

                <FlatList
                    style={{}}
                    contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 10 }}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        </Modal>
    )
}

export default StoreModal

const styles = StyleSheet.create({

    item: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.textBgcolor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    dropDownTextStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.lightText,
        fontFamily: Font.RalewayRegular,
        letterSpacing: 1.2
    },
    searchBox: {
        backgroundColor: COLORS.textBgcolor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: COLORS.textBgcolor,
        borderWidth: 1,
        borderRadius: 8,
    },
});

/**
 * <View style={{ marginLeft: 10, marginRight: 10, }}>
            <TouchableOpacity style={styles.checkboxWrapper} onPress={onPress}>
                <Icon type={Icons.Ionicons} name={isselected ? 'ios-checkbox' : 'ios-square-outline'} size={20} color={isselected ? 'rgba(99,102, 241, 1)' : COLORS.lightGrey} />
                <Text style={[styles.titleText, { marginLeft: 5, flex: 1 }]}>{title}</Text>
            </TouchableOpacity>
        </View>

        handleSearch
        //// const { first, last } = name;
        // if (
        //     first.includes(query) ||
        //     last.includes(query) ||
        //     email.includes(query)) {
        //     return true
        // }
 */