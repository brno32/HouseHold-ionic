import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

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

  groupID : string = ""

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.loadItems()
  }

  refresh(event) {
    this.loadItems()

    if (this.infiniteEvent != null) {
      this.infiniteEvent.enable(true)
    }
    event.complete()
  }

  sortItem(item) {
    this.populatedCategories.add(item.category)

    if (item.isChecked) {
      var index = 0
      for (let i in this.categorized_items[item.category]) {
        if (this.categorized_items[item.category][i].isChecked) {
          index = Number(i); break
        }
      }

      this.categorized_items[item.category].splice(index, 0, item)
    }
    else {
      this.categorized_items[item.category].unshift(item);
    }
  }

  checkIfCategoryEmpty(category) {
    if (this.categorized_items[category].length == 0){
      this.populatedCategories.delete(category)
    }
  }

  checkIfPopulated(category) {
    let populatedCategories : string[] = Array.from(this.populatedCategories)
    return populatedCategories.includes(category)
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

    let list = this.firebaseProvider.getItemsService(this.groupID)

    if (this.groupID == "") {
      this.joinGroupPrompt()
    }

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

  checkItem(item, index) {
    let verb = "Removed "
    if (item.isChecked) {
      verb = "Added "
    }

    this.firebaseProvider.checkItemService(item)
    this.categorized_items[item.category].splice(index, 1)
    this.sortItem(item)

    let toast = this.toastCtrl.create({
      message: verb + item.name + "!",
      duration: 3000,
    }).present();
  }

  joinGroupPrompt() {
    let joinGroupPrompt = this.alertCtrl.create({
    title: 'Find Your HouseHold',
    inputs: [
      {
        name: 'groupName',
        placeholder: 'Your HouseHold',
        // value: item.name,
      },
      {
        password: 'groupPassword',
        type: 'password',
        placeholder: 'HouseHold Password',
      },
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
        text: 'Create HouseHold',
        handler: data => {
          console.log('Create HouseHold clicked')
          this.createGroupPrompt()
        }
      },
      {
        text: 'Join',
        handler: data => {

          // TODO: firebase stuff

          let toast = this.toastCtrl.create({
            message: "Joined " + data.groupName + "!",
            duration: 3000,
          }).present()
        }
      },
    ]
    })

    joinGroupPrompt.present()
  }

  createGroupPrompt() {
    let createGroupPrompt = this.alertCtrl.create({
    title: 'Find Your HouseHold',
    inputs: [
      {
        name: 'groupName',
        placeholder: 'Your HouseHold',
      },
      {
        name: 'groupPassword',
        type: 'password',
        placeholder: 'HouseHold Password',
      },
      {
        name: 'groupPassword2',
        type: 'password',
        placeholder: 'Confirm Password',
      },
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
        text: 'Join',
        handler: data => {

          // TODO: firebase stuff

          let toast = this.toastCtrl.create({
            message: "Created " + data.groupName + "!",
            duration: 3000,
          }).present()
        }
      },
    ]
    })

    createGroupPrompt.present()
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

    createGroupPrompt.present();
  }

  selectCategory(category) {
    this.addItemPrompt(category)
  }

  editItem(item, index) {
    let editPrompt = this.alertCtrl.create({
    title: item.name + ' in ' + item.category,
    enableBackdropDismiss: false,
    buttons: [
      {
        text: 'Edit Item Name',
        handler: data => {
          console.log('Edit Item Name clicked')
          this.editItemName(item, index)
        }
      },
      {
        text: 'Edit Item Category',
        handler: data => {
          this.editItemCategory(item, index)
        }
      },
      {
        text: 'Delete Item',
        handler: data => {
          this.deleteItem(item, index)
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

  editItemName(item, index) {
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
          this.editItem(item, index)
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
          this.categorized_items[item.category].splice(index, 1)
          this.sortItem(updatedItem)

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

  editItemCategory(item, index) {
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
            this.editItem(item, index)
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
            this.categorized_items[item.category].splice(index, 1)
            this.sortItem(updatedItem)
            this.checkIfCategoryEmpty(item.category)

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

  deleteItem(item, index) {
    let alert = this.alertCtrl.create({
      message: 'Delete ' + item.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked')
            this.editItem(item, index)
          }
        },
        {
          text: 'Continue',
          handler: () => {
            this.categorized_items[item.category].splice(index, 1)

            this.firebaseProvider.deleteItemService(item)
            this.checkIfCategoryEmpty(item.category)

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
