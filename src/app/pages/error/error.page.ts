import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Location } from "@angular/common";

const { Network } = Plugins;
@Component({
  selector: "app-error",
  templateUrl: "./error.page.html",
  styleUrls: ["./error.page.scss"],
})
export class ErrorPage implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  async tryConnection() {
    let status = await Network.getStatus();
    console.log(status);

    if (status.connected) {
      this.location.back();
    }
  }
}
