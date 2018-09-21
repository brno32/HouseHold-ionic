import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';

import { DjangoProvider } from '../../providers/django/django';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string = ''
  password: string = ''
  flag = true

  constructor(
    public djangoProvider: DjangoProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidEnter() {
      // TODO: store token in local storage and check here
      // Redirect to list view on verified token
  }

  login() {
    let user = {
      username: this.email,
      password: this.password,
    }

    this.djangoProvider.loginService(user).subscribe(
      data => {
        this.toastCtrl.create({
          message: "Welcome" + "!",
          duration: 3000,
        }).present()
        this.navCtrl.setRoot(ListPage, {
          data: data,
        })
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
  }

  goToSignUp() {
    this.navCtrl.push(SignupPage)
  }

}
