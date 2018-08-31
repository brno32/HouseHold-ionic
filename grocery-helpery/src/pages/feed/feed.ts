import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import moment from 'moment';

import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = ""
  logs: any[] = []
  pageSize: number = 10
  cursor: any
  infiniteEvent: any

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage')
  }

  goToList() {
    this.navCtrl.setRoot(ListPage)
  }

  getLogs() {
    this.logs = []

    let loading = this.loadingCtrl.create({
      content: "Loading feed..."
    });

    loading.present()

    let query = this.firebaseProvider.getLogsService().orderBy("created", "desc").limit(this.pageSize)

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.logs.push(doc)
        })

        loading.dismiss();

        this.cursor = this.logs[this.logs.length - 1]

        console.log(this.logs)

      }).catch((err) => {
        console.log(err)
      })
  }

  loadMoreLogs(event) {
    // Do nothing for now
  }

  refresh(event) {
    this.logs = []
    this.getLogs()

    if (this.infiniteEvent != null) {
      this.infiniteEvent.enable(true)
    }
    event.complete()
  }

  log() {

    const log = {text: "This is a log"}

    this.firebaseProvider.addLogService(log)

    let toast = this.toastCtrl.create({
      message: "Message successfully sent",
      duration: 3000,
    }).present()
    this.getLogs()
  }

  ago(time) {
    let difference = moment(time).diff(moment())
    return moment.duration(difference).humanize()
  }

  logout() {
    this.firebaseProvider.logoutService()
  }

}
