import React from 'react';
import { StyleSheet, View, Image, Text, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';
import db from '../../config';
import moment from "moment";
import firebase from 'firebase'
import noGuardado from '../assets/no-save.png';
import guardado from '../assets/saved.png';

class Card extends React.Component {

  state = {
    name: '',
    nombre: '',
    apellido: '',
    profileImage: null,
    loading: false,
    imageSaved: noGuardado
  }

  componentDidMount() {
    try {
      this.getUsernames();
    }
    catch (error) {
    }
  };

  viewProfile(uid) {
    this.props.navigation.navigate('ViewProfile', {
      uid: uid,
    });
  }

  imageDetails(image, descripcion) {
    this.props.navigation.navigate('ImageDetails', {
      image: image,
      descripcion: descripcion,
      nombre: this.state.nombre,
      apellido: this.state.apellido
    });
  }

  saveImage(image) {
    var user = firebase.auth().currentUser;

    if (user) {
      const usuario = db.firestore().collection('Usuario').doc(user.uid);
      if (this.state.imageSaved == noGuardado) {
        usuario.update({
          saveImages: firebase.firestore.FieldValue.arrayUnion(image)
        });
        this.setState({ imageSaved: guardado })
      } else if (this.state.imageSaved == guardado) {
        usuario.update({
          saveImages: firebase.firestore.FieldValue.arrayRemove(image)
        });
        this.setState({ imageSaved: noGuardado })
      }
    } else {
      // No user is signed in.
    }
  }

  getUsernames() {
    this.setState({
      loading: true,
    });
    var user = firebase.auth().currentUser;
    db.firestore().collection('Usuario').doc(this.props.uid).get()
      .then(doc => {
        
        this.setState({
          name: doc.data().displayName,
          nombre: doc.data().Nombre,
          apellido: doc.data().Apellido,
          loading: false
        });
        profileImage = doc.data().profileImage;
        if (profileImage == null) {
          profileImage = 'https://firebasestorage.googleapis.com/v0/b/wolfat-final.appspot.com/o/profile.jpg?alt=media&token=7f35015c-d7af-44d8-811d-bf794e1ff3c9'
          this.setState({ profileImage })
        } else {
          profileImage = doc.data().profileImage
          this.setState({ profileImage })
        }
        this.getSaved();
      });
  }
  catch(error) {
  }

  getSaved() {
    var user = firebase.auth().currentUser;

    this.setState({
      loading: true,
    });
    db.firestore().collection('Usuario').doc(user.uid).get()
      .then(doc => {
        var saved = [];
        saved = doc.data().saveImages
        if (saved != null && saved.includes(this.props.imageUri)) {
          this.setState({ imageSaved: guardado, loading: false })
        } else {
          this.setState({ imageSaved: noGuardado, loading: false })
        }
      });
  }

  render() {
    if (!this.state.loading) {
      return (
        <View style={styles.card}>
          <Text style={{ color: 'white' }}>{moment(this.props.timestamp).fromNow()}</Text>
          <TouchableHighlight onPress={() => this.imageDetails(this.props.imageUri, this.props.descripcion)} >
            <Image source={{ uri: this.props.imageUri.toString() }}
              style={styles.topCard} />
          </TouchableHighlight>
          <View style={styles.bottomCard}>
            <TouchableHighlight onPress={() => this.viewProfile(this.props.uid)} >
              <Image source={{ uri: this.state.profileImage }} style={{
                borderRadius: 15, width: 30, height: 30,
                marginLeft: 5, marginTop: 5
              }} />
            </TouchableHighlight>
            <Text onPress={() => this.viewProfile(this.props.uid)}
              style={{ color: 'white', marginLeft: 40, marginTop: -25 }}>{this.state.name}</Text>

            <View onStartShouldSetResponder={() => this.saveImage(this.props.imageUri)}>
              <Image source={this.state.imageSaved} style={{ width: 26, height: 26, marginLeft: 130, marginTop: -25 }} />
            </View>
          </View>
        </View>
      );
    } else {
      return null
    }
  }
}

export default withNavigation(Card);

const styles = StyleSheet.create({
  topCard: {
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: 160,
    height: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: 2, },
    shadowColor: 'white',
    marginLeft: 0,
    shadowOpacity: 1.0,
    marginTop: 10,
  },
  bottomCard: {
    backgroundColor: '#330D5A',
    width: 160,
    height: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowOffset: { width: 0, height: 2, },
    shadowColor: 'white',
    marginLeft: 0,
    shadowOpacity: 1.0,
    marginTop: 0,
    opacity: .7
  },
  card: {
    padding: 6,
  }
});

