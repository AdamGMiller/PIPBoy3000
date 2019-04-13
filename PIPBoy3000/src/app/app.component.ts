import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HomePage } from '../pages/home/home';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    androidPermissions: AndroidPermissions,
    screenOrientation: ScreenOrientation) {
    platform.ready().then(() => {

      if (platform.is('android')) {
        //screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE);
        androidPermissions.checkPermission(androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => {
            console.log('Has permission?', result.hasPermission)
            statusBar.styleDefault();
            splashScreen.hide();
          },
          err => androidPermissions.requestPermission(androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        );
      }
      else {
        statusBar.styleDefault();
        splashScreen.hide();
      }
    });
  }
}

