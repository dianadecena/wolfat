import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import {Icon,Container,Header, Content} from 'native-base'

class SavedImages extends Component {
    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                    <Text>SavedImages</Text>
                </Content>
            </Container>
        );
    }
}
export default SavedImages;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});