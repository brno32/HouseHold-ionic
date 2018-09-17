import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';

import { DjangoProvider } from '../../providers/django/django';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string = ''
  email: string = ''
  password: string = ''

  constructor(
    public djangoProvider: DjangoProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
  }

  signUp() {
    let user = {
      first_name: this.name,
      username: this.email,
      password: this.password,
    }

    this.djangoProvider.registerService(user).subscribe(
      data => {
        this.alertCtrl.create({
          title: "Account Created",
          message: "Your account has been created successfully",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.navCtrl.setRoot(ListPage, {
                  data: data,
                })
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
