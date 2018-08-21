import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';

import firebase from 'firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  pageSize = 15
  cursor : any

  categories = [
    'Produce',
    'Breads',
    'Grains',
    'Breakfast',
    'Dairy',
    'Canned Foods',
    'Condiments',
    'Baking',
    'Seasonings',
    'Nuts',
    'Chips',
    'Beverages',
    'Refrigerated',
    'Frozen',
    'Cleaning Products',
    'Toiletries',
    'Pet Care',
    'Miscellaneous',
  ]

  items = []

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.getItems()
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

  getItems() {
    this.items = []

    let loading = this.loadingCtrl.create({
      content: "Loading feed..."
    });

    loading.present();

    let group = firebase.firestore().collection("groups").doc("LTHca0it5AwtUh7hsc4N")

    group.get()
      .then((group_obj) => {

        let group_data = group_obj.data()
        let grocery_list = group_data.list

        for (let item of grocery_list) {
          this.items.push(item.name)
        }

      }).catch((err) => {
        console.log(err);
    })

    loading.dismiss();
  }
}
