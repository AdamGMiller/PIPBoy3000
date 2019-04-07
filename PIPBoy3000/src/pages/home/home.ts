import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Article } from './article';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public currentDate: Date;
  public weather: string;
  public weatherIcon: string;
  public city: string;
  public newsArticles: Article[];

  constructor(public navCtrl: NavController, private http: HttpClient) {

  }

  ngOnInit() {
    // clock - update every second
    this.currentDate = new Date();
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    // get weather immediately and every hour
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
      }, 360000);
    }

    // get news immediately and every 10 minutes
    this.getNews();
    setInterval(() => {
      this.getNews();
    }, 600000);
  }

  getWeather(position) {
    const key = environment.weatherApiKey;
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`

    this.http.get(url).subscribe((result: any) => {
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
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}&pageSize=3`

    this.http.get(url).subscribe((results: any) => {
      this.newsArticles = results.articles;
    });
  }
}
