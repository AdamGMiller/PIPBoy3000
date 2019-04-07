import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public currentDate: Date;
  public weather: string;
  public weatherIcon: string;
  public city: string;

  constructor(public navCtrl: NavController, private http: HttpClient) {

  }

  ngOnInit() {
    // clock
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    if (navigator.geolocation) {
      const location = navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
      console.log(navigator.geolocation);
    }
  } j

  getWeather(position) {
    const key = environment.weatherApiKey;
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`

    this.http.get(url).subscribe((result: any) => {
      console.log(result);
      this.weather = result.weather[0].main;
      this.city = result.name;

      switch (result.weather[0].main.toLowerCase()) {
        case 'rain':
          this.weatherIcon = 'rainy';
          break;
        case 'shower rain':
          this.weatherIcon = 'rainy';
          break;
        case 'clear sky':
          this.weatherIcon = 'sunny';
          break;
        case 'few clouds':
          this.weatherIcon = 'cloud-outline';
          break;
        case 'few clouds':
          this.weatherIcon = 'cloudy';
          break;
        case 'thunderstorm':
          this.weatherIcon = 'thunderstorm';
          break;
        case 'snow':
          this.weatherIcon = 'snow';
          break;
        case 'mist':
          this.weatherIcon = 'cloud-circle';
          break;
      }
    }

    )
  }

  getNews() {
    const key = environment.newsApiKey;
  }
}
