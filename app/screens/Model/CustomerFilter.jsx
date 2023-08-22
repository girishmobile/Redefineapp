import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'

import { useHeaderHeight } from '@react-navigation/elements';
import Font from '../../config/CustomFont';
import { COLORS } from '../../constant';
import Icon, { Icons } from '../../components/Icons';
import Drawline from '../../components/global/Drawline';

import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import RadioButton from '../../components/global/RadioButton';

const statusData = [
    { id: 1, label: 'Active', isSelected: false },
    { id: 2, label: 'Inactive', isSelected: false },
    { id: 3, label: 'Draft', isSelected: false }
];

const CustomerFilter = ({ isVisible, onClose, storeId, onApply, onClear }) => {

    const [openEmail, setIsOpenEmail] = useState(false);
    const [emailId, setIsEmailId] = useState('');
    const [emailError, setIsEmailError] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');

    const [openCreated, setIsOpenCreadted] = useState(false);
    const [openCreatCal, setIsOpenCreatCal] = useState(false);
    const [createdDate, setIsCreatedDate] = useState('');
    const [selectedCreatedDt, setIsSelectedCreatedDt] = useState('');

    const [openUpdated, setIsOpenUpdated] = useState(false);
    const [openUpdateCal, setIsOpenUpdateCal] = useState(false);
    const [updatedDate, setIsUpdatedDate] = useState('');
    const [selectedUpdateDt, setIsSelectedUpdatedDt] = useState('');
    const [openStatus, setIsOpenStatus] = useState(false);

    const [recStatusValue, setIsRecStatusValue] = useState('');
    const [recStatus, setIsRecStatus] = useState('');
    const headerHeight = useHeaderHeight();
    useEffect(() => {

        resetStateVarible();
        return function cleanup() {
        }
    }, [storeId])

    const renderCustomerEmail = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => setIsOpenEmail(!openEmail)} style={styles.touchContainer}>
                    <Text style={styles.subText}>Customer E-mail</Text>
                    <Icon type={Icons.Ionicons} name={openEmail ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {
                    openEmail &&
                    <>
                        <Drawline />
                        <View style={{ margin: 10, borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor, padding: 10 }}>
                            <TextInput
                                style={{
                                    paddingVertical: 0,
                                    flex: 1,
                                    color: COLORS.titleColor,
                                    fontFamily: Font.RalewayRegular,
                                    fontSize: 14,
                                    letterSpacing: 1.2
                                }}
                                placeholder='Email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                autoCorrect={false}
                                value={emailId}
                                onChangeText={(text) => {

                                    setIsEmailId(text);
                                    validateEmail(text)

                                }
                                }
                            />

                        </View>
                        {
                            emailError && <Text style={styles.errorMsgText}>{errorMsg}</Text>
                        }
                    </>
                }
            </View>
        )
    }

    const renderCreatedDate = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => setIsOpenCreadted(!openCreated)} style={styles.touchContainer}>
                    <Text style={styles.subText}>Created Date</Text>
                    <Icon type={Icons.Ionicons} name={openCreated ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openCreated && <>
                    <Drawline />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        <View style={{ margin: 10, borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                            <TouchableOpacity style={styles.orderDateWrapper} onPress={() => setIsOpenCreatCal(!openCreatCal)}>
                                <Text style={[styles.subText, { marginLeft: 5, flex: 1 }]}>{createdDate}</Text>
                                <Icon type={Icons.Ionicons} name={'calendar-outline'} size={20} color={COLORS.lightText} />
                            </TouchableOpacity>
                            <Drawline />
                            {openCreatCal && <Calendar onDayPress={(day) => {
                                if (day['dateString'] !== null || day['dateString'] !== '') {
                                    let serviceDate = moment(day['dateString']);
                                    serviceDate = serviceDate.format("MM/DD/YYYY");
                                    setIsCreatedDate(serviceDate);
                                    setIsSelectedCreatedDt(day['dateString']);
                                }
                            }
                            }
                                markedDates={{
                                    [selectedCreatedDt]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                                }} />
                            }
                        </View>
                    </View>
                </>
                }
            </View>
        )
    }
    const renderUpdatedDate = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => setIsOpenUpdated(!openUpdated)} style={styles.touchContainer}>
                    <Text style={styles.subText}>Updated Date</Text>
                    <Icon type={Icons.Ionicons} name={openUpdated ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openUpdated && <>
                    <Drawline />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        <View style={{ margin: 10, borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                            <TouchableOpacity style={styles.orderDateWrapper} onPress={() => setIsOpenUpdateCal(!openUpdateCal)}>
                                <Text style={[styles.subText, { marginLeft: 5, flex: 1 }]}>{updatedDate}</Text>
                                <Icon type={Icons.Ionicons} name={'calendar-outline'} size={20} color={COLORS.lightText} />
                            </TouchableOpacity>
                            <Drawline />
                            {openUpdateCal && <Calendar onDayPress={(day) => {
                                if (day['dateString'] !== null || day['dateString'] !== '') {
                                    let serviceDate = moment(day['dateString']);
                                    serviceDate = serviceDate.format("MM/DD/YYYY");
                                    setIsUpdatedDate(serviceDate);
                                    setIsSelectedUpdatedDt(day['dateString']);
                                }
                            }
                            }
                                markedDates={{
                                    [selectedUpdateDt]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                                }} />
                            }
                        </View>
                    </View>
                </>
                }
            </View>
        )
    }
    const renderStatus = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => setIsOpenStatus(!openStatus)} style={styles.touchContainer}>
                    <Text style={styles.subText}>Status</Text>
                    <Icon type={Icons.Ionicons} name={openStatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openStatus && <>
                    <Drawline />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        <RadioButton
                            data={statusData}
                            isSelected={recStatusValue}
                            onSelected={(recValue) => onSelectedStatus(recValue)}
                            onClear={() => clearStatus()} />

                    </View>
                </>}
            </View>
        )
    }
    const renderFooter = () => {
        return (
            <View style={{
                backgroundColor: COLORS.primary, marginLeft: 20, marginRight: 20, marginBottom: 20, borderRadius: 4,
                borderWidth: 0.75,
                borderColor: COLORS.borderColor,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10
            }}>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity onPress={() => clearFilter()}>
                        <Text style={styles.subText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: 'rgba(112, 212, 75,1)', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity onPress={() => applyFilter()}>
                        <Text style={[styles.subText, { color: '#fff' }]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            setIsEmailError(true);
            setIsErrorMsg('Please enter valid email Id.');
            return false;
        }
        else {
            setIsEmailError(false);
            setIsErrorMsg('');
            return true;
        }
    }
    const onSelectedStatus = (recValue) => {

        setIsRecStatusValue(recValue);

        let recText = '';
        switch (recValue) {
            case "Active":
                recText = "A";
                break;
            case "Inactive":
                recText = "I";
                break;
            case "Draft":
                recText = "D";
                break;
            default:
                break;
        }
        setIsRecStatus(recText);


    }
    const clearFilter = () => {
        resetStateVarible();
        onClear();
    }
    const applyFilter = () => {
        filterPayload = [];
        filterCount = 0;
        if (emailId.trim().length > 0 || emailId != '') {
            if (validateEmail(emailId)) {
                filterCount = filterCount + 1;
                filterPayload.push({
                    "field": "email",
                    "operator": 0,
                    "value": emailId
                });
            }
        }
        if (createdDate.trim().length > 0 || createdDate != '') {
            console.log(createdDate);
            filterCount = filterCount + 1;
            filterPayload.push({
                "field": "createddate",
                "operator": 1,
                "value": `${createdDate}`
            })
        }
        if (updatedDate.trim().length > 0 || updatedDate != '') {
            console.log(updatedDate);
            filterCount = filterCount + 1;
            filterPayload.push({
                "field": "modifiedDate",
                "operator": 1,
                "value": `${updatedDate}`
            })
        }
        if (recStatus != '') {

            filterCount = filterCount + 1;
            filterPayload.push({
                "field": "recStatus",
                "operator": 0,
                "value": recStatus
            })
        }
        if (filterPayload.length > 0) {
            filterPayload.splice(0, 0, { "field": "storeId", "operator": 1, "value": storeId });
            const params = {
                "payload": filterPayload,
                "count": filterCount
            }
            onApply(params);
        }
    }
    const closeModal = () => {
        onClose();
    }
    const resetStateVarible = () => {

        setIsOpenEmail(false);
        setIsEmailId('');
        setIsEmailError(false);
        setIsOpenCreadted(false);
        setIsOpenUpdated(false);
        setIsOpenStatus(false);

        setIsErrorMsg('');
        setIsRecStatus('');
        setIsRecStatusValue('');
        setIsCreatedDate('');
        setIsSelectedCreatedDt('');
        setIsUpdatedDate('');
        setIsSelectedUpdatedDt('');
    }
    return (
        <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => onClose()} style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.1)', }} />
                <View style={styles.baseView}>
                    <View style={{ height: headerHeight, justifyContent: 'flex-end' }}>
                        <View style={styles.headerstyle}>
                            <Text style={styles.titleText}>{'More Filter'}</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Icon type={Icons.Ionicons} name={'close-outline'} size={30} color={COLORS.lightText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Drawline />
                    <ScrollView style={{ with: '100%' }}>
                        <View style={{ flex: 1, margin: 20, }}>
                            {renderCustomerEmail()}
                            {renderCreatedDate()}
                            {renderUpdatedDate()}
                            {renderStatus()}
                        </View>
                    </ScrollView>
                    {renderFooter()}
                </View>
            </View>
        </Modal>
    )
}

export default CustomerFilter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    baseView: {
        height: '100%',
        width: '70%',
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
    },
    headerstyle: {
        height: 44,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: Font.RalewaySemiBold,
        fontSize: 16,
        letterSpacing: 1.2,
        color: COLORS.lightText,
    },
    rowContainer: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 0.75,
        borderColor: COLORS.borderColor,
        marginBottom: 5,
    },
    touchContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subText: {
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        letterSpacing: 1.2,
    },
    errorMsgText: {
        color: COLORS.officialRed,
        opacity: 0.9,
        fontFamily: Font.RalewayRegular,
        letterSpacing: 1.2,
        fontSize: 11,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        textAlign: 'left',

    },
    orderDateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 5
    }
})