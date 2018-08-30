import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera'

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup'
import { FeedPage } from '../pages/feed/feed'
import { ListPage } from '../pages/list/list';

import firebase from 'firebase';
import { FirebaseProvider } from '../providers/firebase/firebase';

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
    ListPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage,
    ListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    Camera,
  ]
})
export class AppModule {}
