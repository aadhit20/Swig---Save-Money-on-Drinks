import {
  InAppBrowser,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
import { Component, OnInit } from "@angular/core";
import { AppAvailability } from "@ionic-native/app-availability/ngx";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.page.html",
  styleUrls: ["./contact-us.page.scss"],
})
export class ContactUsPage implements OnInit {
  constructor(
    private appAvailability: AppAvailability,
    private inAppBrowser: InAppBrowser,
    private platform: Platform
  ) {}

  ngOnInit() {}

  fbClick() {
    let url = "https://www.facebook.com/Swig_official-101266588498379";
    let name = "Swig_official-101266588498379";
    let app;
    if (this.platform.is("ios")) {
      app = "fb://";
    } else if (this.platform.is("android")) {
      app = "com.facebook.katana";
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create(
        "https://www.facebook.com/" + name
      );
      return;
    }

    this.appAvailability.check(app).then(
      (yes: boolean) => {
        console.log(app + " is available");
        // Success
        // App exists
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "fb://facewebmodal/f?href=" + url,
          "_system"
        );
      },
      (no: boolean) => {
        // Error
        // App does not exist
        // Open Web URL
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "https://www.facebook.com/" + name,
          "_system"
        );
      }
    );
  }

  twitterClick() {
    let app;
    let name = "OfficialSwig";

    if (this.platform.is("ios")) {
      app = "twitter://";
    } else if (this.platform.is("android")) {
      app = "com.twitter.android";
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create(
        "https://twitter.com/" + name,
        "_system"
      );
      return;
    }

    this.appAvailability.check(app).then(
      (yes: boolean) => {
        console.log(app + " is available");
        // Success
        // App exists
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "twitter://user?screen_name=" + name,
          "_system"
        );
      },
      (no: boolean) => {
        // Error
        // App does not exist
        // Open Web URL
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "https://twitter.com/" + name,
          "_system"
        );
      }
    );
  }

  emailClick() {
    window.location.href = "mailto:" + "hola@taskjornal.com";
  }

  instaClick() {
    let app;
    let name = "swig_official";

    if (this.platform.is("ios")) {
      app = "instagram://";
    } else if (this.platform.is("android")) {
      app = "com.instagram.android";
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create(
        "https://www.instagram.com/" + name
      );
      return;
    }

    this.appAvailability.check(app).then(
      (yes: boolean) => {
        console.log(app + " is available");
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "instagram://user?username=" + name,
          "_system"
        );
      },
      (no: boolean) => {
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          "https://www.instagram.com/" + name,
          "_system"
        );
      }
    );
  }
}
