import { Component, OnInit } from "@angular/core";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Component({
  selector: "app-invite-friends",
  templateUrl: "./invite-friends.page.html",
  styleUrls: ["./invite-friends.page.scss"],
})
export class InviteFriendsPage implements OnInit {
  text =
    "Swig - Save Money on Drinks, Download the app on App Store https://apps.apple.com/us/app/swig-save-money-on-drinks/id1544289078 or Play Store https://play.google.com/store/apps/details?id=com.onlinedeals.swig";
  imgurl =
    "https://firebasestorage.googleapis.com/v0/b/swig-3e8ed.appspot.com/o/icon.png?alt=media&token=d6d039cc-f40e-49fe-b5e1-f3d7e8e83452";
  linkIOS =
    "https://apps.apple.com/us/app/swig-save-money-on-drinks/id1544289078";
  linkAndroid =
    "https://play.google.com/store/apps/details?id=com.onlinedeals.swig";
  constructor(private socialSharing: SocialSharing) {}

  ngOnInit() {}

  fbClick() {
    this.socialSharing.shareViaFacebook(this.text, this.imgurl);
  }

  twitterClick() {
    this.socialSharing.shareViaTwitter(this.text, this.imgurl);
  }

  instaClick() {
    this.socialSharing.shareViaInstagram(this.text, this.imgurl);
  }

  whatsappClick() {
    this.socialSharing.shareViaWhatsApp(this.text, this.imgurl);
  }
}
