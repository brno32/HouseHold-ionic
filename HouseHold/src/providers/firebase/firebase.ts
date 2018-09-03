import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import firebase from 'firebase';

@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FirebaseProvider Provider')
  }

  getLogsService() {
    console.log("Logs loaded")
    return firebase.firestore().collection("logs")
  }

  getItemsService() {
    console.log("Items loaded")
    return firebase.firestore().collection("items")
  }

  addLogService(log) {
    firebase.firestore().collection("logs").add({
      text: log.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName,
    }).then((doc) => {

    }).catch((err) => {
      console.log(err)
    })
  }

  addItemService(data, category) {
    firebase.firestore().collection("items").add({
      name: data.name,
      category: category,
      isChecked: false,
    }).then((doc) => {
      console.log(data.name + " added");
    }).catch((err) => {
      console.log(err)
    })
  }

  updateItemService(item, updatedItem) {
    firebase.firestore().collection("items").doc(item.id).update(updatedItem).then((doc) => {
      console.log(item.name + " updated");
    }).catch((err) => {
      console.log(err)
    })
  }

  deleteItemService(item) {
    firebase.firestore().collection("items").doc(item.id).delete().then((doc) => {
      console.log(item.name + " deleted")
    }).catch((err) => {
      console.log(err)
    })
  }

  checkItemService(item) {
    firebase.firestore().collection("items").doc(item.id).update(item).then((doc) => {
      console.log(item.name + " checked")
    }).catch((err) => {
      console.log(err)
    })
  }

  logoutService() {
    firebase.auth().signOut().then(() => {
      console.log("Signed out")
    });
  }

}
