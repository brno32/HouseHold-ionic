import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
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

  token = ""

  constructor(
    public djangoProvider: DjangoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    this.token = navParams.get('data')
  }

  findGroup() {
    let group = {
      name: this.name,
      password: this.password,
    }

    this.djangoProvider.findGroupService(group, this.token).subscribe(
      data => {
        this.alertCtrl.create({
          title: "HouseHold found!",
          message: "You have successfully joined " + this.name,
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.navCtrl.setRoot(ListPage, {
                  data: this.token,
                })
              }
            }
          ],
        }).present()

      },
      err => {
        console.log(this.name + " not found.")
      }
    )
  }

  goToCreateGroupPage() {
    this.navCtrl.push(CreateGroupPage, {
      data: this.token,
    })
  }

}
