import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';

import firebase from 'firebase';
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
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          if (this.flag) {
            this.navCtrl.setRoot(ListPage)
          }

          this.flag = false
        } else {
          // No user is signed in.
        }
      })
  }

  login() {
    let user = {
      username: this.email,
      password: this.password,
    }

    this.djangoProvider.loginService(user).subscribe(
      token => {
        this.toastCtrl.create({
          message: "Welcome" + "!",
          duration: 3000,
        }).present()
        console.log(token.token)
        this.navCtrl.setRoot(ListPage, {
          data: token,
        })
      },
      err => {
        console.log("Error occured")
      }
    )
  }

  goToSignUp() {
    this.navCtrl.push(SignupPage)
  }

}
