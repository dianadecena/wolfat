import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'firebase';
import db from '../config';
import Button from './components/Button';
import header from './assets/wolfat2.jpg';
import papelera from './assets/delete.png';
import profile from './assets/profile.jpg';
import Card from './components/CardProfile';
import CardProfile from './components/CardProfile';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Container, Header, Content, Left} from 'native-base'
var nombre, apellido, ubicacion, descripcion, fotoPerfil, imagesUser = [], savedImages = [], username, result, uid, timestamp;

class Profile extends React.Component {
  state = {
    nombre,
    apellido,
    ubicacion,
    descripcion,
    imagesUser,
    savedImages,
    fotoPerfil,
    opcion: 'VER GUARDADAS',
    username,
    result,
    uid,
    timestamp,
    loading: false
  }


  _isMounted = false;

  componentDidMount = () => {
    try {
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };

  retrieveData = async () => {
    try {
      this.setState({
        loading: true,
      });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user.uid);

          db.firestore().collection('Usuario').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
              nombre = doc.data().Nombre
              apellido = doc.data().Apellido
              ubicacion = doc.data().Ubicacion
              descripcion = doc.data().Descripcion
              imagesUser = doc.data().images
              //savedImages = doc.data().savedImages
              fotoPerfil = doc.data().profileImage
              console.log(fotoPerfil)
              username = doc.data().displayName
              uid = doc.data().uid
              this.setState({ nombre })
              this.setState({ apellido })
              this.setState({ ubicacion })
              this.setState({ descripcion })
              if (imagesUser != null) {
                var new_images = imagesUser.reverse()
                this.setState({ imagesUser: new_images })
              } 
              /*if(savedImages.length != null) {
                var savedImages = savedImages.reverse()
                this.setState({ savedImages: savedImages })
              }*/
              if (fotoPerfil == null) {
                fotoPerfil = 'https://firebasestorage.googleapis.com/v0/b/wolfat-7c5c9.appspot.com/o/profile.jpg?alt=media&token=1089243a-2aa6-4648-a318-604e0c4a9503'
                this.setState({ fotoPerfil })
              } else {
                fotoPerfil = doc.data().profileImage
                this.setState({ fotoPerfil })
              }
              this.setState({ username })
              this.setState({ uid })
              this.setState({ opcion: 'VER GUARDADAS' })
              this.setState({ loading: false })
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
        } else {
          // No user is signed in.
        }
      });

    }
    catch (error) {
      console.log(error);
    }
  }

  retrieveSaved = async () => {
    try {
      this.setState({
        loading: true,
      });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user.uid);

          db.firestore().collection('Usuario').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
              nombre = doc.data().Nombre
              apellido = doc.data().Apellido
              ubicacion = doc.data().Ubicacion
              descripcion = doc.data().Descripcion
              savedImages = doc.data().saveImages
              fotoPerfil = doc.data().profileImage
              username = doc.data().displayName
              uid = doc.data().uid
              console.log(uid)
              this.setState({ nombre })
              this.setState({ apellido })
              this.setState({ ubicacion })
              this.setState({ descripcion })
              if (savedImages != null) {
                var saved = savedImages.reverse()
                this.setState({ imagesUser: saved })
                this.setState({ opcion: 'VER SUBIDAS' })
              }
              if (fotoPerfil == null) {
                fotoPerfil = 'https://firebasestorage.googleapis.com/v0/b/wolfat-7c5c9.appspot.com/o/profile.jpg?alt=media&token=1089243a-2aa6-4648-a318-604e0c4a9503'
                this.setState({ fotoPerfil })
              } else {
                fotoPerfil = doc.data().profileImage
                this.setState({ fotoPerfil })
              }
              this.setState({ username })
              this.setState({ uid })
              this.setState({ loading: false })
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
        } else {
          // No user is signed in.
        }
      });

    }
    catch (error) {
      console.log(error);
    }
  }

  signOut() {
    firebase.auth().signOut().then(function () {
      console.log('Sesion Cerrada')

    }).catch(function (error) {
      console.log(error)
    });
  }

  cerrarSesion() {
    this.props.navigation.navigate('Init');
  }

  uploadImage() {
    this.props.navigation.navigate('SubirImagen');
  }

  toUpdate = async () => {
    this.props.navigation.navigate('EditarPerfil');
  }

  toProfile = async () => {

    this.props.navigation.navigate('Dashboard');
  }

  changeProfilePic() {
    this.props.navigation.navigate('FotoPerfil');
  }

  verGuardadas() {
    console.log(this.state.opcion)
    if (this.state.opcion === 'VER GUARDADAS') {
      console.log('entro')
      this.retrieveSaved()
    } else if (this.state.opcion === 'VER SUBIDAS') {
      this.retrieveData()
    }
  }

  render() {

    const items = []
    if (Array.isArray(imagesUser) && imagesUser.length) {
      for (const [index, image] of this.state.imagesUser.entries()) {
        items.push(<CardProfile imageUri={image} uid={this.state.uid} opcion={this.state.opcion} key={index} />)
      }
    }

    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    if (this.state.imagesUser == null) {
      return (
        <View style={styles.container}>
          <Text>NO POSTS YET</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.backgroundContainer} decelerationRate={'fast'}
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.retrieveData}
          />
        }>
        <View>
          <Image source={header} style={{ height: 200 }} />
          <View style={{ marginTop: -50, alignItems: 'center', justifyContent: 'center' }}
            onStartShouldSetResponder={() => this.changeProfilePic()}>
            <Image source={{ uri: fotoPerfil }} style={{ borderRadius: 50, width: 100, height: 100 }} />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ color: 'white' }}>@{this.state.username}</Text>
            <Text style={{ color: 'white' }}>{this.state.nombre} {this.state.apellido}</Text>
            <Text style={{ color: 'white' }}>{this.state.ubicacion}</Text>
            <Text style={{ color: 'white' }}>{this.state.descripcion}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', height: 40 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 50, marginTop: 10, marginLeft: 20,
              backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
            }}
              onStartShouldSetResponder={() => this.signOut()}
            >
              <Image style={{ resizeMode: 'cover' }}
                source={require('./assets/logout.png')} />
            </View>
            <View style={{
              width: 40, height: 40, borderRadius: 50, marginTop: 10, marginRight: 20,
              backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'
            }}
              onStartShouldSetResponder={() => this.uploadImage()}
            >
              <Image style={{ resizeMode: 'cover' }}
                source={require('./assets/camera.png')} />
            </View>
          </View>
          <View onStartShouldSetResponder={() => this.toUpdate()} style={{ width: 215, marginTop: -45, marginLeft: 75, marginRight: 80 }}>
            <Button text="Edit profile" background="white" color="#330D5A" onPress={this.toUpdate} />
          </View>

          <View style={{ width: 215, marginTop: 20, marginLeft: 130, marginRight: 80 }}>
            <Text onStartShouldSetResponder={() => this.verGuardadas()}
              style={{ color: 'white' }}>{this.state.opcion}</Text>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            {items}
          </View>

        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414'
  },
  backgroundContainer: {
    backgroundColor: '#141414',
    width: null,
    height: null,
  },
  card: {
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: 260,
    height: 360,
    borderRadius: 20,
    marginLeft: 5,
    marginBottom: 25,
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
  }
});