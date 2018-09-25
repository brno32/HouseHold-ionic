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

  createGroup() {
    let group = {
      name: this.name,
      password: this.password,
    }

    this.djangoProvider.createGroupService(group, this.token).subscribe(
      data => {
        this.alertCtrl.create({
          title: "HouseHold created!",
          message: "You have successfully created " + this.name,
          buttons: [
            {
              text: "Ok",
              handler: () => {

                this.djangoProvider.findGroupService(group, this.token).subscribe(
                  data => {
                    this.navCtrl.setRoot(ListPage, {
                      data: this.token,
                    })
                  },
                  err => {
                    console.log(this.name + " not found.")
                  }
                )
              }
            }
          ],
        }).present()

      },
      err => {
        console.log("Error occured")
      }
    )
  }

  goBack() {
    this.navCtrl.pop()
  }

}
