import { StyleSheet, Text, View, Dimensions, ScrollView, FlatList, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { Appscreen, Loader } from '../components/global';
import productApi from '../api/product';
import useApi from '../hooks/useApi';
import FastImageView from '../components/global/FastImageView';
import GlobalStyle from '../styles/GlobalStyle';
import ProductImages from '../components/items/ProductImages';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { COLORS } from '../constant';

const regex = /(<([^>]+)>)/ig;
const secondRegEx = /((&nbsp;))*/gmi;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const ProductDetals = ({ navigation, route }) => {

    const { productId } = route.params;


    const [isLoader, setIsLoader] = useState(false);
    const [product, setIsProduct] = useState(null);
    const [productImages, setProductImages] = useState(null);
    const [attributesData, setAttributesData] = useState(null);

    const [prodIndex, setProductIndex] = useState(0);

    const scrollX = React.useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();
    const getprodDetail = useApi(productApi.getProductDetailById);
    const getAttributeImg = useApi(productApi.getAttributesImages);
    const getprodAttributes = useApi(productApi.getProductAttributes);

    const getProductDetail = async () => {
        setIsLoader(true);
        const response = await getprodDetail.request(productId);
        setIsLoader(getprodDetail.isLoader);
        const mydata = response['data'];
        if (mydata != null) {
            setIsProduct(mydata['data']);
        }
        getAttributesImages();

    }
    const getProductAttributes = async () => {
        setIsLoader(true)
        const response = await getprodAttributes.request(productId);
        setIsLoader(false);
        const mydata = response['data'];
        if (mydata != null) {

        }
    }
    const getAttributesImages = async () => {
        setIsLoader(true);
        const params = { 'productId': productId }
        const response = await getAttributeImg.request(params);
        setIsLoader(getAttributeImg.isLoader);
        const mydata = response['data'];
        if (mydata != null) {
            const attributes = mydata['data'];
            if (attributes != null) {
                setAttributesData(attributes);
            }
            if (attributes.length > 0) {
                const subRows = attributes[0]['subRows'];
                setProductImages(subRows);
            }
        }

    }
    useEffect(() => {

    }, [prodIndex]);

    useEffect(() => {

        if (productId != null || productId != undefined) {
            getProductDetail();
        }
        return function cleanup() {

        }
    }, []);
    const renderDescription = () => {

        if (product['description'] != null) {
            const result = product['description'].replace(regex, '');
            const description = result.replace(secondRegEx, '');
            return (
                <Text style={[GlobalStyle.lightText, { textAlign: 'left' }]}>{`Description \n${description}`}</Text>
            );
        }
    }
    const changedProduct = (index) => {

        setProductIndex(index);
        if (attributesData != null) {
            if (attributesData[index]['subRows'].length > 0) {
                setProductImages(attributesData[index]['subRows']);
            }
            else {
                const item = [
                    {
                        'imagePath': `${attributesData[index]['swatch']}`,
                        'attributeOptionId': `${attributesData[index]['attributeOptionId']}`
                    }
                ]
                setProductImages(item);
            }
        }
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={styles.container}>
                    {
                        product != null && <ScrollView bounces={true} showsVerticalScrollIndicator={false}>
                            <View style={{ width: SCREEN_WIDTH, height: 20 }} />
                            {
                                productImages != null && productImages.length > 0 ? <>
                                    <FlatList
                                        contentContainerStyle={{ backgroundColor: 'green' }}
                                        data={productImages}
                                        keyExtractor={(_, inedx) => inedx.toString()}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                            {
                                                useNativeDriver: false,
                                            }
                                        )}
                                        bounces={false}
                                        renderItem={({ item }) => <ProductImages item={item} />}
                                    />
                                    <View style={{ width: SCREEN_WIDTH, height: 50, }}>

                                        <ExpandingDot
                                            data={productImages}
                                            expandingDotWidth={20}
                                            scrollX={scrollX}
                                            inActiveDotOpacity={0.6}
                                            activeDotColor={COLORS.officialRed}
                                            inActiveDotColor={COLORS.officialRed}
                                            dotStyle={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: COLORS.officialRed,
                                                borderRadius: 4,
                                                borderColor: COLORS.officialRed,
                                                borderWidth: 1,
                                                marginHorizontal: 5,
                                                alignSelf: 'center',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        />
                                    </View>
                                </> : <FastImageView imageUrl={product['productImage']} />
                            }
                            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                <Text style={GlobalStyle.subtitleText}>{product['name']}</Text>
                                <Text style={[GlobalStyle.subtitleText, {}]}>{`Sale Price:- $${product['salePrice']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 14, }]}>{`Brand: ${product['brandName']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 14, opacity: 0.7, marginTop: 0 }]}>{`Attributes`}</Text>
                                {attributesData != null &&
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                                        {
                                            attributesData.map((item, index) =>
                                                <TouchableOpacity key={index.toString()} onPress={() => changedProduct(index)}>
                                                    <View key={`${item['attributeOptionId']}`} style={{ paddingEnd: 15, paddingTop: 10, paddingBottom: 10, }} >
                                                        <View style={{ width: 100, backgroundColor: '#fff', borderColor: prodIndex === index ? COLORS.secondary : COLORS.lightText, borderWidth: 1, padding: 5 }}>
                                                            <View style={{ height: 45, width: 45, backgroundColor: 'blue', alignSelf: 'center', marginVertical: 5 }}>
                                                                <FastImageView imageUrl={`${item['swatch']}`} />
                                                            </View>
                                                            <Text style={[GlobalStyle.lightText, { fontSize: 12, lineHeight: 14, }]}>{`${item['colorName']}`}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                }
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, marginTop: 0 }]}>{`Category Name: ${product['categoryName']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, marginTop: 0 }]}>{`Category Name: ${product['categoryName']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, marginTop: 0 }]}>{`RootPath: ${product['categoryRootPath']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, marginTop: 0 }]}>{`Created: ${product['createdName']}`}</Text>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, marginTop: 0 }]}>{`Created Date: ${product['createdDate']}`}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[GlobalStyle.subtitleText, { fontSize: 13, opacity: 0.7, width: 55, alignSelf: 'center', }]}>Status:</Text>
                                    <View style={[GlobalStyle.recStatus(product['recStatus']), { width: '30%' }]}>
                                        <Text style={GlobalStyle.recStatusText(product['recStatus'])}>{product['recStatus'] === 'A' ? 'Active' : product['recStatus'] === 'I' ? 'Inactive' : 'Draft'}</Text>
                                    </View>
                                </View>
                                {renderDescription()}
                            </View>
                        </ScrollView>
                    }
                </View>
            </Appscreen >
        </>
    )
}

export default ProductDetals

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    button: (recStatus) => (
        {
            backgroundColor: recStatus === 'A' ? 'rgba(220, 252, 231,1)' : recStatus === 'I' ? 'rgba(241, 169, 171,1)' : 'rgba(241, 245, 249,1)',
            padding: 7,
            margin: 15,
            borderRadius: 4,
            width: '80%',
            borderColor: recStatus === 'A' ? 'rgba(134,239 , 172,1)' : recStatus === 'I' ? 'rgba(228, 83, 122, 1)' : 'rgba(241, 245, 249, 1)', //71-85-105
            borderWidth: 0.6,
        }
    ),
    buttonText: (recStatus) => (
        {
            color: recStatus === 'A' ? 'rgba(22, 163, 74,1)' : recStatus === 'I' ? 'rgba(198,36 ,40,1)' : 'rgba(71,85 ,105,1)',
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: 1.2,
            fontWeight: '500'
        }
    ),
})


// <View style={{ padding: 20 }}>
//<FastImageView imageUrl={product['productImage']} />
//</View>
  //const callback = route.params?.callback;
    //const [state, dispatch] = useReducer(reducer, { age: 30 });
    //const [state, dispatch] = useReducer(messengerReducer, initialState);
    //Redux
// function reducer(state, action) {

//     if (action.type === 'incremented_age') {

//         return {
//             age: state.age + 1
//         }
//     }
//     throw Error('Unknown action.');

// }
//const sendDataToPreviousScreen = () => {

    // const data = "Hello from NextScreen!";
    // callback && callback(data);
    // dispatch({
    //     type: 'changed_selection',
    //     contactId: 1,
    // });

    //dispatch(addItem('Redux'));

  //  navigation.goBack();
//}
 //{/* <Text>{`Hello! You are ${state.age}`}</Text> */}
            //{/* <Button title=' Increment age' onPress={() => { dispatch({ type: 'incremented_age' }) }} /> */}