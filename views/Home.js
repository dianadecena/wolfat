import React from 'react';
import { StyleSheet, View, ImageBackground, Image, Text } from 'react-native';
import bgImage from './assets/background.png';
import tattoo from './assets/tattoo-machine.png';
import salon from './assets/salon.png';
import piercing from './assets/piercing.png';
import cosmetics from './assets/cosmetics.png';
import { Dimensions } from "react-native";
import logo from './assets/wolfat.png';
import * as Font from 'expo-font';
import Button from './components/Button'

var width = Dimensions.get('window').width;

class Home extends React.Component {

  state = {
    fontLoaded: false,
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      'old-london': require('./assets/fonts/OldLondon.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>
      <View style={{marginTop: 60, padding: 20}}> 
      { this.state.fontLoaded ? (
            <Text style={{ fontFamily: 'old-london', fontSize: 90, color: '#141414' }}>
              wolfat
            </Text>
          ) : null }
      </View>
      <View style={{marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
      <Button text="Create Account" background="black" color="white"/>
      <Button text="Sign in with Google" background="white" color="black"/>
      </View>
    </ImageBackground>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
  }
});

