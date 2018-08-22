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

  populatedCategories : string[]
  categorized_items = {}

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.loadItems()
  }

  goToFeed() {
    this.navCtrl.setRoot(FeedPage);
  }

  loadItems() {
    this.populatedCategories = new Set([])
    for (let category of this.categories) {
      this.categorized_items[category] = []
    }

    let loading = this.loadingCtrl.create({
      content: "Loading feed..."
    });

    loading.present();

    let list = firebase.firestore().collection("items")

    list.get()
      .then((docs) => {
        docs.forEach((doc) => {
          let item = doc.data()
          item['id'] = doc.id
          this.sortItem(item)
        })

      }).catch((err) => {
        console.log(err);
    })

    loading.dismiss();
  }

  sortItem(item) {
    this.populatedCategories.add(item.category)
    this.categorized_items[item.category].push(item)
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
            this.loadItems()
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
