import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string = '';
  email: string = '';
  password: string = '';

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  signUp() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {

        console.log(data);

        let newUser: firebase.User = data.user;
        newUser.updateProfile({
          displayName: this.name,
          photoURL: "",
        }).then(() => {
          console.log("Updated")

          this.alertCtrl.create({
            title: "Account Created",
            message: "Your account has been created successfully",
            buttons: [
              {
                text: "Ok",
                handler: () => {
                  this.navCtrl.setRoot(HomePage)
                }
              }
            ],
          }).present();

        }).catch((err) => {
          console.log(err);
        })

    }).catch((err) => {
      console.log(err);

      this.toastCtrl.create({
        message: err.message,
        duration: 3000,
      }).present();
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

}
