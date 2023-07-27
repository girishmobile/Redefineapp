import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { PieChart, } from 'react-native-gifted-charts';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

const Piachart = ({ pieData }) => {

    const renderDot = color => {
        return (
            <View
                style={{
                    height: 15,
                    width: 15,
                    borderRadius: 4,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };
    const renderLegendComponent = () => {
        return (
            <>
                <View style={{
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {pieData.map((item) => (
                        <View key={uuid()} style={{ flexDirection: 'row', marginVertical: 3 }} >
                            {renderDot(item.color)}
                            <Text>{item.name + ':-  ' + item.text}</Text>
                        </View>
                    ))}

                </View>
            </>
        )
    }
    return (
        <>
            <View key={uuid()}>
                <PieChart
                    key={uuid()}
                    donut={true}
                    isThreeD={true}
                    data={pieData}
                    shadow={true}
                />
            </View>
            {renderLegendComponent()}
        </>
    )
}
export default Piachart
const styles = StyleSheet.create({

})