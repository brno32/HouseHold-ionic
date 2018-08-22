import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {

    this.getItems()
    for (let category of this.categories) {
      this.categorized_list[category] = []
    }
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

  addItemPrompt() {
    let prompt = this.alertCtrl.create({
    title: 'Add Item',
    inputs: [
      {
        name: 'name',
        placeholder: 'Name of item'
      },
      {
        name: 'category',
        placeholder: 'Produce, Grains, etc...',
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Add',
        handler: data => {
          firebase.firestore().collection("items").add({
          name: data.name,
          category: data.category,
          isChecked: false,
        }).then((doc) => {
          let toast = this.toastCtrl.create({
            message: "Item successfully added",
            duration: 3000,
          }).present();

        }).catch((err) => {

          console.log(err);

        })
        }
      }
    ]
    });
    prompt.present();
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
