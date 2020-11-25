import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;
@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  imgPath = "assets/images/avatar.jpg";
  constructor() {}

  ngOnInit() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
    });

    var imageUrl = image.webPath;
    this.imgPath = imageUrl;
    console.log(imageUrl);

    // Can be set to the src of an image now
    //  imageElement.src = imageUrl;
  }
}
