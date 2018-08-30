import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import firebase from 'firebase';

@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FirebaseProvider Provider');
  }

  getItemsService() {
    return firebase.firestore().collection("items")
  }

  addItemService(data, category) {
    firebase.firestore().collection("items").add({
      name: data.name,
      category: category,
      isChecked: false,
    }).then((doc) => {
      // TODO: trigger signal for success toast
    }).catch((err) => {
      console.log(err);
    })
  }

  updateItemService(item, updatedItem) {
    firebase.firestore().collection("items").doc(item.id).update(updatedItem).then((doc) => {
      // TODO: trigger signal for success toast
    }).catch((err) => {
      console.log(err);
    })
  }

  deleteItemService(item) {
    firebase.firestore().collection("items").doc(item.id).delete().then((doc) => {
      // TODO: trigger signal for success toast
    }).catch((err) => {
      console.log(err);
    })
  }

  checkItemService(item) {
    firebase.firestore().collection("items").doc(item.id).update(item).then((doc) => {
      // TODO: trigger signal for success toast
    }).catch((err) => {
      console.log(err);
    })
  }

  logoutService() {
    firebase.auth().signOut().then(() => {
      // TODO: trigger signal for success toast
    });
  }

}
