import React, { Component } from "react";
import {ImageBackground, TouchableHighlight } from 'react-native';
import {
    View,
    StyleSheet,
    TextInput,
    Alert
} from "react-native";
import Button from './components/Button';
import bg from './assets/login1.jpg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import firebase from 'firebase';
import db from '../config';

class Login extends Component {

    state = {
        email: '', password: ''
    }

    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }

    toProfile = async () => {
        this.props.navigation.navigate('Init');
    }

    login = async () => {
        const { email, password } = this.state
        if (this.state.email != '' && this.state.password != '') {
            db.firestore().collection('Usuario').where('email', '==', email).where('password', '==', password).get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        Alert.alert('Error', 'El email y la contraseña no coinciden')
                        return;
                    }
                    else {
                        console.log('Si existe');
                        firebase.auth().signInWithEmailAndPassword(email, password)
                        this.props.navigation.navigate('Dashboard');
                    }
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                });
        } else {
            Alert.alert('Error', 'No se pueden dejar campos en blanco')
        }

    }

    render() {
        return (
            <ImageBackground source={bg} style={styles.backgroundContainer}>
                <View style={styles.container}>
                    <View style={{ marginTop: hp('20%') }}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            autoCapitalize="none"
                            placeholderTextColor='white'
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.nombre}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Contraseña'
                            secureTextEntry={true}
                            autoCapitalize="none"
                            placeholderTextColor='white'
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <TouchableHighlight onPress={this.login}>
                            <Button
                                text="LOGIN" background="#330D5A" color="white" onPress={this.login}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
            </ImageBackground>


        );
    }
}
export default Login

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    input: {
        width: wp('90%'),
        height: hp('8%'),
        backgroundColor: 'transparent',
        margin: '2.5%',
        padding: '2.5%',
        color: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        fontSize: hp('2.5%'),
        fontWeight: '300'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonWrapper: {
        overflow: 'hidden',
        marginBottom: hp('2.5%'),
        height: hp('10%'),
        width: wp('70%'),
        marginTop: hp('5%')
    }
});