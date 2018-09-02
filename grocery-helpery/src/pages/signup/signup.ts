import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedPage } from '../feed/feed';

import { Camera, CameraOptions } from '@ionic-native/camera'

import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string = ''
  email: string = ''
  password: string = ''

  image: string
  imageURL : string

  constructor(
    public camera: Camera,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
  }

  signUp() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {
        let newUser: firebase.User = data.user
        newUser.updateProfile({
          displayName: this.name,
          photoURL: this.imageURL,
        }).then(() => {
          console.log("Updated")
          var userID = firebase.auth().currentUser.uid
          this.upload(userID)
          this.alertCtrl.create({
            title: "Account Created",
            message: "Your account has been created successfully",
            buttons: [
              {
                text: "Ok",
                handler: () => {
                  this.navCtrl.setRoot(FeedPage)
                }
              }
            ],
          }).present()
        }).catch((err) => {
          console.log(err)
        })

    }).catch((err) => {
      console.log(err)
      this.toastCtrl.create({
        message: err.message,
        duration: 3000,
      }).present()
    })
  }

  goBack() {
    this.navCtrl.pop()
  }

  addPhoto() {
    this.launchCamera()
  }

  launchCamera() {
    let options : CameraOptions = {
      quality: 90,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true,
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = "data:image/png;base64," + base64Image

    }).catch((err) => {
      console.log(err)
    })
  }

  upload(name: string) {
    let ref = firebase.storage().ref("userImages/" + name)

    let uploadTask = ref.putString(this.image.split(",")[1], "base64")

    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot)
    }, (error) => {
      console.log(error)
    }, () => {
      console.log("Upload Complete!")

      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url)
        this.imageURL = url
      })

    })
  }

}
