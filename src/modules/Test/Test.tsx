import React from 'react'
import { View, Text } from 'react-native';

const Test = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ textAlign: 'left', flexShrink: 1, }}>TesestjhkTestTestTestTesttTest</Text>
                <Text style={{ textAlign: 'right', marginLeft: 40, flexShrink: 1, }}>stTestTestTestTestTestest</Text>
            </View>
        </View>
    )
}

export default Test