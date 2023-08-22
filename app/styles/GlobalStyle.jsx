import { StyleSheet, Dimensions } from "react-native";
import Font from "../config/CustomFont";
import { COLORS } from "../constant";

const { height, width } = Dimensions.get('screen');
export default StyleSheet.create({
    titleText:
    {
        fontFamily: Font.RalewayBold,
        color: COLORS.secondary,
        opacity: 0.9,
        fontSize: 16,
        letterSpacing: 1.2,
        marginVertical: 10,
        textAlign: 'center',
        width: '100%'
    },
    subtitleText:
    {
        fontFamily: Font.RalewaySemiBold,
        color: COLORS.titleColor,
        opacity: 0.9,
        fontSize: 14,
        letterSpacing: 1.2,
        marginVertical: 5,
        textAlign: 'left',
        textTransform: 'capitalize',
        width: '100%',
    },
    nameText: {
        color: COLORS.titleColor,
        opacity: 0.9,
        letterSpacing: 1.2,
        fontSize: 13,
        padding: 5,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontFamily: Font.RalewayBold,
        width: '90%',

    },
    brandText: {
        color: COLORS.titleColor,
        opacity: 0.7,
        letterSpacing: 1.2,
        fontSize: 12,
        padding: 5,
        textAlign: 'center',
        width: '90%',
        fontFamily: Font.RalewaySemiBold
    },
    lightText: {
        fontSize: 13,
        opacity: 0.7,
        lineHeight: 18,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        fontFamily: Font.RalewayRegular,
        textAlign: 'center'
    },
    priceText: {
        color: COLORS.titleColor,
        opacity: 0.9,
        letterSpacing: 1.2,
        fontSize: 13,
        width: '90%',
        textAlign: 'center',
        fontFamily: Font.RalewaySemiBold
    },
    boardItem: {
        width: (width / 2) - 15,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    storeNameText: {
        fontSize: 13,
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2
    },
    card: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    recStatus: (recStatus) => (
        {
            backgroundColor: recStatus === 'A' ? 'rgba(220, 252, 231,1)' : recStatus === 'I' ? 'rgba(241, 169, 171,1)' : 'rgba(241, 245, 249,1)',
            padding: 7,
            margin: 10,
            borderRadius: 4,
            borderColor: recStatus === 'A' ? 'rgba(134,239 , 172,1)' : recStatus === 'I' ? 'rgba(228, 83, 122, 1)' : 'rgba(241, 245, 249, 1)', //71-85-105
            borderWidth: 0.6,
        }
    ),
    recStatusText: (recStatus) => (
        {
            color: recStatus === 'A' ? 'rgba(22, 163, 74,1)' : recStatus === 'I' ? 'rgba(198,36 ,40,1)' : 'rgba(71,85 ,105,1)',
            textAlign: 'center',
            fontSize: 13,
            letterSpacing: 1.2,
            fontFamily: Font.RalewaySemiBold,
        }
    ),
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
    errorTextMsg: {
        color: COLORS.titleColor,
        opacity: 0.7,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2,
        fontSize: 13,
        padding: 5,
        textAlign: 'center',

    },

});