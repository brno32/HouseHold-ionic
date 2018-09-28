import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';
import { GroupPage } from '../group/group';

import { DjangoProvider } from '../../providers/django/django';

@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {

  name: string = ''
  password: string = ''

  constructor(
    public djangoProvider: DjangoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {}

  createGroup() {
    let group = {
      name: this.name,
      password: this.password,
    }

    this.djangoProvider.createGroupService(group).subscribe(
      data => {
        this.djangoProvider.findGroupService(group).subscribe(
          data => {
            this.showSuccessToast()

            this.navCtrl.setRoot(ListPage)
          },
          err => {
            console.log(this.name + " not found.")
          }
        )
      },
      err => {
        console.log("Error occured")
      }
    )
  }

  goBack() {
    this.navCtrl.pop()
  }

  showSuccessToast() {
    let toast = this.toastCtrl.create({
      message: this.name + " created",
      duration: 3000,
    }).present()
  }

}
