import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup'
import { FeedPage } from '../pages/feed/feed'
import { HomePage } from '../pages/home/home';

import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBIKDvdgxOBt2HL9wlzPVrDHONjbeOevgc",
    authDomain: "grocery-app-d1fc1.firebaseapp.com",
    databaseURL: "https://grocery-app-d1fc1.firebaseio.com",
    projectId: "grocery-app-d1fc1",
    storageBucket: "grocery-app-d1fc1.appspot.com",
    messagingSenderId: "870514586428"
};

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true,
})

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
