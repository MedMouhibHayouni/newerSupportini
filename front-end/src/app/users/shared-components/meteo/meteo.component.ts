import { Component, OnInit } from '@angular/core';
import { GeoLocalisationService } from "../../../shared-service/geoLocalisationService/geo-localisation.service";
import { gsap } from 'gsap';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit {
  WeatherData: any = {
    main: {},
    sys: {},
    wind: {},
    isDay: true
  };
  currentDate = new Date();

  constructor(private geolocalisationservice: GeoLocalisationService) {}

  ngOnInit(): void {
    this.getLocation();
    this.animateCard();
  }

  animateCard(): void {
    gsap.from('.weather-card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    });
  }

  getLocation(): void {
    this.geolocalisationservice.getLocationService().then(res => {
      this.getWeatherData(res.lng, res.lat);
    }).catch(err => console.log(err));
  }

  getWeatherData(lng: number, lat: number): void {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6ec9e04e85c0c9f0917e60845016303f`)
      .then(response => response.json())
      .then(data => this.setWeatherData(data));
  }

  setWeatherData(data: any): void {
    this.WeatherData = data;
    const sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    const currentDate = new Date();
    this.WeatherData.isDay = currentDate.getTime() < sunsetTime.getTime();
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
  }

  getWeatherDescription(): string {
    if (!this.WeatherData.weather || !this.WeatherData.weather[0]) return 'Conditions inconnues';

    const descriptions: {[key: string]: string} = {
      'clear': 'Dégagé',
      'clouds': 'Nuageux',
      'rain': 'Pluvieux',
      'snow': 'Neigeux',
      'thunderstorm': 'Orage',
      'drizzle': 'Bruine',
      'mist': 'Brume',
      'smoke': 'Fumée',
      'haze': 'Brume sèche',
      'dust': 'Poussière',
      'fog': 'Brouillard',
      'sand': 'Tempête de sable',
      'ash': 'Cendres volcaniques',
      'squall': 'Rafales',
      'tornado': 'Tornade'
    };

    return descriptions[this.WeatherData.weather[0].main.toLowerCase()] ||
           this.WeatherData.weather[0].description;
  }

  getTime(timestamp: number): string {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
