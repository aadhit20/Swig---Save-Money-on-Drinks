import { Router } from "@angular/router";
import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Plugins } from "@capacitor/core";

const { Network } = Plugins;
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    let handler = Network.addListener("networkStatusChange", (status) => {
      console.log("Network status changed", status);
      console.log(status);

      if (!status.connected) {
        this.router.navigate(["/error"]);
      }
    });
    let status = await Network.getStatus();
    if (!status.connected) {
      this.router.navigate(["/error"]);
    }
    // To stop listening:
    // handler.remove();

    // Get the current network status

    // Example output:
    // {
    //   "connected": true,
    //   "connectionType": "wifi"
    // }
  }
}
