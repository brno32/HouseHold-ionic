import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import moment from 'moment';
import firebase from 'firebase';

import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = "";
  logs: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
  }

  goToList() {
    this.navCtrl.setRoot(ListPage)
  }

  getLogs() {
    this.logs = []

    let loading = this.loadingCtrl.create({
      content: "Loading feed..."
    });

    loading.present();

    let query = firebase.firestore().collection("logs").orderBy("created", "desc").limit(this.pageSize);

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.logs.push(doc)
        })

        loading.dismiss();

        this.cursor = this.logs[this.logs.length - 1];

        console.log(this.logs);

      }).catch((err) => {
        console.log(err);
      })
  }

  loadMoreLogs(event) {
    // Do nothing for now
  }

  refresh(event) {
    this.logs = [];
    this.getLogs();

    if (this.infiniteEvent != null) {
      this.infiniteEvent.enable(true);
    }
    event.complete();
  }

  log() {

    firebase.firestore().collection("logs").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName,
    }).then((doc) => {
      this.text = "";
      let toast = this.toastCtrl.create({
        message: "Message successfully sent",
        duration: 3000,
      }).present();
      this.getLogs();
    }).catch((err) => {
      console.log(err);
    })
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
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
