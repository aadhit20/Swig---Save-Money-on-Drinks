import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType } from "@capacitor/core";
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
const { Camera } = Plugins;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  userSubscription: Subscription;
  userDetails: any = {};
  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.subscribeUserDetails();
  }

  ngOnInit() {
    this.subscribeUserDetails();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    //  imageElement.src = imageUrl;
  }

  public subscribeUserDetails() {
    this.userSubscription = this.userService
      .loadCurrentUserDetails()
      .subscribe((res) => {
        console.log("Profile page subscription", res);
        this.userDetails = res;
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Invite option coming soon.",
      duration: 2000,
      position: "top",
    });
    toast.present();
  }

  async logOut() {
    if (JSON.parse(localStorage.getItem("isFacebookLogin"))) {
      await Plugins.FacebookLogin.logout();
    }
    localStorage.removeItem("email");
    this.router.navigate(["/login"]);
  }
}
