import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { FeedPage } from '../feed/feed';
import { ListPage } from '../list/list';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string = ''
  password: string = ''

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  ionViewWillEnter() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.navCtrl.setRoot(ListPage)
      } else {
        // No user is signed in.
      }
    });
  }

  login() {
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
      console.log(user)

      this.toastCtrl.create({
        message: "Welcome, " + user.user.displayName + "!",
        duration: 3000,
      }).present()

      this.navCtrl.setRoot(FeedPage)

  }).catch((err) => {
    console.log(err)

    this.toastCtrl.create({
      message: err.message,
      duration: 3000,
    }).present()
  })
}

  goToSignUp() {
    this.navCtrl.push(SignupPage)
  }

}
