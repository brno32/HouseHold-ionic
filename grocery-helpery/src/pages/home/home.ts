import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {

  }

  logout() {
    firebase.auth().signOut().then(() => {

      let toast = this.toastCtrl.create({
        message: "Logged out",
        duration: 3000,
      }).present();

      this.navCtrl.setRoot(LoginPage);
    });
  }

}
