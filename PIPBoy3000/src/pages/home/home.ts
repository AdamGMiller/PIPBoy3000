import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Article } from './article';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from 'ionic-angular';
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public currentDate: Date;
  public weather: string;
  public weatherIcon: string;
  public city: string;
  public temperatureF: number;
  public temperatureC: number;
  public newsArticles: Article[];

  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    private insomnia: Insomnia,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic,
    private platform: Platform) {

  }

  ngOnInit() {
    // alias for promises
    var that = this;

    if (this.platform.is('android')) {
      this.platform.ready().then(() => {
        this.insomnia.keepAwake()
          .then(
            () => console.log('success setting insomnia'),
            () => console.log('error setting insomnia')
          );
      });
    }

    // clock - update every second
    this.currentDate = new Date();
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    // get weather immediately and every hour
    this.platform.ready().then(() => {
      this.getUserPosition().then((resp: Geoposition) => {
        const lat = resp.coords.latitude;
        const lon = resp.coords.longitude;
        that.getWeather(lat, lon);
        setInterval(() => {
          that.getWeather(lat, lon);
        }, 360000);
      });
    });

    // get news immediately and every 10 minutes
    this.getNews();
    setInterval(() => {
      this.getNews();
    }, 600000);
  }

  getWeather(lat: number, lon: number) {
    const key = environment.weatherApiKey;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`

    this.http.get(url).subscribe((result: any) => {
      this.weather = result.weather[0].main;
      this.city = result.name;
      this.temperatureF = ((result.main.temp - 273.15) * 1.8) + 32;
      this.temperatureC = result.main.temp - 273.15;

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
        case 'clouds':
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

  getUserPosition() {
    return new Promise(resolve => {
      const HIGH_ACCURACY = 'high_accuracy';
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          if (this.platform.is('android')) {
            this.diagnostic.getLocationMode().then(locationMode => {
              if (locationMode === HIGH_ACCURACY) {
                this.geolocation.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
                  resolve({
                    coords: {
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude
                    }
                  });
                }).catch(error => resolve(error));
              } else {
                this.askForHighAccuracy().then(available => {
                  if (available) {
                    this.getUserPosition().then(a => resolve(a), e => resolve(e));
                  }
                }, error => resolve(error));
              }
            });
          } else {
            this.geolocation.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
              resolve({
                coords: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                }
              });
            }).catch(error => resolve(error));
          }
        }, error => {
          resolve(error)
        });
      } else {
        //resolve('Cordova is not available');

        // browser support
        this.geolocation.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
          resolve({
            coords: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          });
        }).catch(error => resolve(error));

      }
    });
  }

  askForHighAccuracy(): Promise<Geoposition> {
    return new Promise(resolve => {
      this.locationAccuracy
        .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.geolocation.getCurrentPosition({ timeout: 30000 }).then(
            position => {
              resolve(position);
            }, error => resolve(error)
          );
        }, error => resolve(error));
    });
  }



}

