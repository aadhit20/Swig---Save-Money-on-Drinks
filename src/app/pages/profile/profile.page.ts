import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {}

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
}
