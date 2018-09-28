import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';
import { GroupPage } from '../group/group';

import { DjangoProvider } from '../../providers/django/django';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  email: string = ''
  password: string = ''

  constructor(
    public djangoProvider: DjangoProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage,
  ) {
  }

  signUp() {
    let user = {
      username: this.email,
      password: this.password,
    }

    this.djangoProvider.registerService(user).subscribe(
      data => {
        this.djangoProvider.loginService(user).subscribe(
          data => {
            if (data.hasOwnProperty('auth_token')) {
              this.storage.set('token', data['auth_token'])
              this.navCtrl.setRoot(GroupPage)
              this.showSuccessToast()
            }
          },
          err => {
            // TODO: handle all possible errors and display message to user
            console.log(err)
            this.toastCtrl.create({
              message: "Username and password do not match.",
              duration: 3000,
            }).present()
          }
        )
      },
      err => {
        console.log("Error occured")
      }
    )
  }

  showSuccessToast() {
    let toast = this.toastCtrl.create({
      message: "Account created successfully!",
      duration: 3000,
    }).present();
  }

  goBack() {
    this.navCtrl.pop()
  }

}
