import { Component } from '@angular/core';
import { Events, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';
import { CreateGroupPage } from '../create-group/create-group';

import { DjangoProvider } from '../../providers/django/django';

@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  name: string = ''
  password: string = ''

  constructor(
    public djangoProvider: DjangoProvider,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    this.events.publish('setToken', '')
  }

  findGroup() {
    let group = {
      name: this.name,
      password: this.password,
    }

    this.djangoProvider.findGroupService(group).subscribe(
      data => {
        this.showSuccessToast()
        this.navCtrl.setRoot(ListPage)
      },
      err => {
        console.log(this.name + " not found.")
      }
    )
  }

  goToCreateGroupPage() {
    this.navCtrl.push(CreateGroupPage)
  }

  showSuccessToast() {
    let toast = this.toastCtrl.create({
      message: this.name + " joined",
      duration: 3000,
    }).present();
  }

}
