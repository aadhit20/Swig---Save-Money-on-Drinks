import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType } from "@capacitor/core";
import { Subscription } from "rxjs";
const { Camera } = Plugins;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  userSubscription: Subscription;
  userDetails: any = {};
  constructor(private userService: UserService) {}

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
}
