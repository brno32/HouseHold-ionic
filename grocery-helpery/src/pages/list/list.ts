import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';
import { ListCategoryPage } from '../list-category/list-category'

import firebase from 'firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

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

  goToFeed() {
    this.navCtrl.setRoot(FeedPage);
  }

  goToCategory() {
    this.navCtrl.push(ListCategoryPage);
  }

}
