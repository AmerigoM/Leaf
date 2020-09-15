import React, { Component } from "react";
import { ImageBackground, View } from 'react-native';
import Weather from './src/components/Weather';
import { Header } from 'react-native-elements';

//==============================================
// App.js
//============================================== 

export default class App extends Component {

  render() {
    return (
        <ImageBackground source={require('./src/resources/screenImage.jpg')} style={{width: '100%', height: '100%'}}>
            <View>
                <Header
                    containerStyle={{backgroundColor: '#bb5d00', opacity: 0.8}}
                    leftComponent={{ icon: 'spa', color: '#fff', size: 40 }} 
                    centerComponent={{ text: 'Leaf', style: { color: '#fff', fontSize: 24} }} 
                />
                <Weather />
            </View>
        </ImageBackground>
    );
  }

}