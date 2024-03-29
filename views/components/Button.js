import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Button extends React.Component {



    render() {
        const {
            onPress,
          } = this.props; 
    return (
      
        <View style={[styles.wrapper, {backgroundColor: this.props.background}]}>
        
          
            <TouchableHighlight 
               useForeground={true}
            onPress={onPress}
          >
            <View style={styles.buttonText}>
              <Text style={{color:this.props.color}}>{this.props.text}</Text>
            </View>
            </TouchableHighlight> 
          
         
        </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    display: 'flex',
    paddingLeft: wp('5%'),
    paddingRight: wp('5%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('3%'),
    alignItems: 'center',
  }
});

