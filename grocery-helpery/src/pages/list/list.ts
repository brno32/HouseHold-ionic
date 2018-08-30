import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  pageSize = 15
  cursor : any
  infiniteEvent: any

  readonly categories = [
    'Produce',
    'Breads',
    'Grains',
    'Breakfast',
    'Dairy',
    'Meats',
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
  categorized_items = {}

  numberOfItems : number = 0

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.loadItems()
  }

  goToFeed() {
    this.navCtrl.setRoot(FeedPage)
  }

  refresh(event) {
    this.loadItems()

    if (this.infiniteEvent != null) {
      this.infiniteEvent.enable(true)
    }
    event.complete()
  }

  checkIfPopulated(category) {
    let populatedCategories : string[] = Array.from(this.populatedCategories)
    return populatedCategories.includes(category)
  }

  editItem(item) {
    let editPrompt = this.alertCtrl.create({
    title: item.name + ' in ' + item.category,
    buttons: [
      {
        text: 'Edit Item Name',
        handler: data => {
          console.log('Edit Item Name clicked')
          this.editItemName(item)
        }
      },
      {
        text: 'Edit Item Category',
        handler: data => {
          this.editItemCategory(item)
        }
      },
      {
        text: 'Delete Item',
        handler: data => {
          this.deleteItem(item)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked')
        }
      },
    ]
    })

    editPrompt.present()
  }

  editItemName(item) {
    let editItemNamePrompt = this.alertCtrl.create({
    title: 'Editing: ' + item.name + ' in ' + item.category,
    inputs: [
      {
        name: 'name',
        placeholder: item.name,
        value: item.name,
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked')
          this.editItem(item)
        }
      },
      {
        text: 'Update',
        handler: data => {

          let updatedItem = {
            id: item.id,
            name: data.name,
            category: item.category,
            isChecked: item.isChecked,
          }

          this.firebaseProvider.updateItemService(item, updatedItem)
          this.loadItems()

          let toast = this.toastCtrl.create({
            message: "Updated item!",
            duration: 3000,
          }).present()
        }
      },
    ]
    })

    editItemNamePrompt.present()
  }

  editItemCategory(item) {
    let radioButtons = []
    for (let category of this.categories) {
      let category_obj = {
        type: 'radio',
        value: category,
        label: category,
      }
      radioButtons.push(category_obj)
    }

    let categoryPrompt = this.alertCtrl.create({
      title: 'Move ' + item.name + ' to ',
      inputs: radioButtons,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked')
            this.editItem(item)
          }
        },
        {
          text: 'Continue',
          handler: data => {
            let updatedItem = {
              id: item.id,
              name: item.name,
              category: data,
              isChecked: item.isChecked,
            }

            this.firebaseProvider.updateItemService(item, updatedItem)
            this.loadItems()
            let toast = this.toastCtrl.create({
              message: "Updated item!",
              duration: 3000,
            }).present()
          }
        }
      ]
    })

    categoryPrompt.present()
  }

  deleteItem(item) {
    let alert = this.alertCtrl.create({
      message: 'Delete ' + item.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked')
            this.editItem(item)
          }
        },
        {
          text: 'Continue',
          handler: () => {
            this.loadItems()
            this.firebaseProvider.deleteItemService(item)

            let toast = this.toastCtrl.create({
              message: "Deleted " + item.name,
              duration: 3000,
            }).present();
          }
        }
      ]
    })
    alert.present()
  }

  loadItems() {
    this.numberOfItems = 0
    this.populatedCategories = new Set([])
    for (let category of this.categories) {
      this.categorized_items[category] = []
    }

    let loading = this.loadingCtrl.create({
      content: "Loading grocery list..."
    })

    loading.present()

    let list = this.firebaseProvider.getItemsService()

    list.get()
      .then((docs) => {
        docs.forEach((doc) => {
          let item = doc.data()
          item['id'] = doc.id
          this.sortItem(item)
          this.numberOfItems += 1
        })
      }).catch((err) => {
        console.log(err)
    })

    loading.dismiss()
  }

  sortItem(item) {
    this.populatedCategories.add(item.category)
    this.categorized_items[item.category].push(item)
  }

  checkItem(item) {
    let verb = "Removed "
    if (item.isChecked) {
      verb = "Added "
    }

    this.firebaseProvider.checkItemService(item)

    let toast = this.toastCtrl.create({
      message: verb + item.name + "!",
      duration: 3000,
    }).present();
  }

  selectCategoryPrompt() {
    let radioButtons = []
    for (let category of this.categories) {
      let category_obj = {
        type: 'radio',
        value: category,
        label: category,
      }
      radioButtons.push(category_obj)
    }

    let categoryPrompt = this.alertCtrl.create({
      title: 'Which Category?',
      inputs: radioButtons,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked')
          }
        },
        {
          text: 'Continue',
          handler: data => {
            this.addItemPrompt(data)
          }
        }
      ]
    })

    categoryPrompt.present();
  }

  selectCategory(category) {
    this.addItemPrompt(category)
  }

  addItemPrompt(category) {
    let itemPrompt = this.alertCtrl.create({
    title: 'Add Item to ' + category,
    inputs: [
      {
        name: 'name',
        placeholder: 'Name of item'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked')
        }
      },
      {
        text: 'Add',
        handler: data => {
          this.firebaseProvider.addItemService(data, category)
          this.loadItems()

          let toast = this.toastCtrl.create({
            message: "Added " + data.name + "!",
            duration: 3000,
          }).present()
        }
      }
    ]
    })

    itemPrompt.present()
  }

  checkout() {
    let checkoutPrompt = this.alertCtrl.create({
      title: 'Checkout',
      message: 'Delete all checked items?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked')
          }
        },
        {
          text: 'Continue',
          handler: () => {
            console.log('Checkout clicked')
          }
        }
      ]
    })

    checkoutPrompt.present()
  }

  logout() {
    this.firebaseProvider.logoutService()
    this.navCtrl.setRoot(LoginPage)

    let toast = this.toastCtrl.create({
      message: "Logged out",
      duration: 3000,
    }).present()
  }
}
