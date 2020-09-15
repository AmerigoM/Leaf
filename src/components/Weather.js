import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View
} from "react-native";
import axios from 'axios';
import { Card, Button, Icon, Input } from 'react-native-elements';
import { Spinner } from './common/Spinner';


//==============================================
// Weather class
//============================================== 

export default class Weather extends Component {

	state = {
		latitude: '',
		longitude: '',
		weather: '',
		city: '',
		temp: '',
		error: '',
		displayError: false,
		loading: true,
		inputField: ''
	};


	componentWillMount() {
		this.findCoordinates();
	}


  // method to retrieve the current coordinates from the GPS
  	findCoordinates = () => {
	  	navigator.geolocation.getCurrentPosition(
	  		position => {
	  			const location = JSON.stringify(position);

	  			this.setState({ 
	  				latitude: position.coords.latitude,
	  				longitude: position.coords.longitude
	  			});

	  			this.getWeather();
	  		},
	  		error => {
	  			this.setState({ error: error });
	  		},
	  		{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
	  	);

  	};

  	//==============================================
	// Networking
	//============================================== 

  	// callback method to get the current weather condition of the current location
  	getWeather = () => {
  		this.setState({ error: '', loading: true });

		// request to openWeatherMaps
		axios.get('https://api.openweathermap.org/data/2.5/weather', {
			params: {
				'lat': this.state.latitude,
				'lon': this.state.longitude,
				'appid': '985a96abb23a0395be86d99635ac1e4f'
			}
		})
		.then( response => {
			this.setState({ 
				weather: response.data.weather[0].description,
				city: response.data.name + ", " + response.data.sys.country,
				temp: (parseInt(response.data.main.temp - 273.15)),
				error: '',
				loading: false
			}) 
		})
		.catch( error => {
			this.setState({ error: error, loading: false })
		});
	}


	// clabback method to get the current weather condition depending on the city inserted in the text label
	getWeatherByCity = () => {
		if(this.state.inputField === '') {
			this.setState({ displayError: true });
			return;
		} else {
			this.setState({ displayError: false });
		}

		this.setState({ loading: true });

		axios.get('https://api.openweathermap.org/data/2.5/weather', {
			params: {
				'q' : this.state.inputField,
				'appid': '985a96abb23a0395be86d99635ac1e4f'
			}
		})
		.then( response => {
			this.setState({ 
				weather: response.data.weather[0].description,
				city: response.data.name + ", " + response.data.sys.country,
				temp: (parseInt(response.data.main.temp - 273.15)),
				error: '',
				loading: false
			}) 
		})
		.catch( error => {
			this.setState({ error: error, loading: false })
		});
	}


	//==============================================
	// Components' rendering methods
	//============================================== 

  	// render the search box
  	renderSearch() {
  		return(
  			<Card title="Change weather" containerStyle={styles.cardStyle}>
  				<Input 
  					placeholder='Enter city name'
  					onSubmitEditing = { this.getWeatherByCity.bind(this) }
  					onChangeText = {text => this.setState({inputField: text}) } 
  					errorMessage = {this.state.displayError ? "This field is required." : null}
  				/>
  				<View style={{paddingTop: 20}}>
		  			<Button
			  			icon={{name: 'search', type: 'font-awesome', color:'white'}}
			  			title="Search city"
			  			buttonStyle={{backgroundColor: '#bb5d00'}}
			  			onPress={ this.getWeatherByCity.bind(this) }
		  			/>
  				</View>
  			</Card>
  			);
  	}


  	// render the weather info box
  	renderWeatherInfo() {
  		if(this.state.loading) {
  			return(
  				<Card title="Weather forecast" containerStyle={styles.cardStyle}>
  					<Spinner />
  				</Card>
  				);
  		}

  		if(!this.state.error) {
  			return (
  				<Card title="Weather forecast" containerStyle={styles.cardStyle} >
	  				<Text style={styles.textStyle}>Location: {this.state.city}</Text>
	  				<Text style={styles.textStyle}>Current weather: {this.state.weather}</Text>
	  				<Text style={styles.textStyle}>Temperature: {this.state.temp} °C</Text>
  				</Card>
  				);
  		}

  		return(
  			<Card title="Weather forecast" containerStyle={styles.cardStyle}>
	  			<Text style={styles.textStyle}>Location unavailable</Text>
	  			<Text style={styles.textStyle}>Current weather unavailable</Text>
	  			<Text style={styles.textStyle}>Temperature unavailable</Text>
  			</Card>
  			);

  	}

	//==============================================
	// Render method
	//============================================== 
	render() {
		return(
			<View>
				{this.renderWeatherInfo()}
				{this.renderSearch()}
			</View>
			);
	}
}


//==============================================
// Style
//============================================== 
const styles = StyleSheet.create({

	textStyle: {
		fontSize:18,
		paddingBottom: 5,
		color: '#696969',
		justifyContent: 'center'
	},

	cardStyle: {
		opacity: 0.9
	}
});