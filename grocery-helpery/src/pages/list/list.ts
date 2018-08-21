import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';

import firebase from 'firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
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

  populatedCategories = new Set([])

  items = []

  categorized_list = {}

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.getItems()

    for (let category of this.categories) {
      this.categorized_list[category] = []
    }
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

    let list = firebase.firestore().collection("items")

    list.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.sortItem(doc.id, doc.data())
        })

      }).catch((err) => {
        console.log(err);
    })

    loading.dismiss();
  }

  sortItem(id, item) {
    this.populatedCategories.add(item.category)
    item['id'] = id
    this.categorized_list[item.category].push(item)
  }

  updateItem(item) {
    firebase.firestore().collection("items").doc(item.id).update(item).then((doc) => {

      let toast = this.toastCtrl.create({
        message: "Item successfully updated",
        duration: 3000,
      }).present();

    }).catch((err) => {

      console.log(err);

    })
  }
}
