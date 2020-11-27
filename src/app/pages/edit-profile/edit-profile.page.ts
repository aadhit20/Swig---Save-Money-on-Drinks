import { UserService } from "src/app/shared/services/user.service";
import { AlertController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;
@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  imagePath = "assets/images/avatar.jpg";
  profileForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      fname: new FormControl("", Validators.compose([Validators.required])),
      lname: new FormControl("", Validators.compose([Validators.required])),
      age: new FormControl(""),
      location: new FormControl(""),
    });
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.userService.loadCurrentUserDetails().subscribe(
        (res: any) => {
          if (res.profileImage) {
            this.imagePath = res.profileImage;
          } else {
            this.imagePath = "";
          }
          loadingEl.dismiss();
          this.profileForm.patchValue({
            fname: res.fname,
            lname: res.lname,
            age: res.age,
            location: res.location,
          });
        },
        (err) => {
          loadingEl.dismiss();
        }
      );
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
    });

    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    console.log(imageUrl);
    this.imagePath = imageUrl;

    // Can be set to the src of an image now
    //  imageElement.src = imageUrl;
  }

  async updateDetails() {
    if (this.profileForm.valid) {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        let userData = {
          fname: this.profileForm.value["fname"],
          lname: this.profileForm.value["lname"],
          age: this.profileForm.value["age"],
          location: this.profileForm.value["location"],
          profileImage: this.imagePath,
        };
        this.userService
          .updateUser(localStorage.getItem("email"), userData)
          .subscribe(
            async (res) => {
              loadingEl.dismiss();
              const alert = await this.alertCtrl.create({
                header: "Success",
                message: "Changes Saved",
                buttons: ["Ok"],
              });
              alert.present();
            },
            async (err) => {
              const alert = await this.alertCtrl.create({
                header: "Success",
                message: err,
                buttons: ["Ok"],
              });
              alert.present();
              loadingEl.dismiss();
            }
          );
      });
    } else {
      const alert = await this.alertCtrl.create({
        header: "Error",
        message: "All the fields with * are required",
        buttons: ["Ok"],
      });
      alert.present();
    }
  }
}
