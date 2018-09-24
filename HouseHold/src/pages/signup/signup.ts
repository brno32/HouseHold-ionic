import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ListPage } from '../list/list';
import { GroupPage } from '../group/group';

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
                    
                    this.navCtrl.setRoot(GroupPage, {
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
