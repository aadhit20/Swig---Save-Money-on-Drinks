import { Router } from "@angular/router";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import { from, timer } from "rxjs";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
  PositionError,
} from "@ionic-native/geolocation/ngx";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  deals = [];
  nearbyDeals = [];
  currentPos;
  constructor(
    private dealService: DealsService,
    private router: Router,
    private geolocation: Geolocation,
    private http: HttpClient
  ) {}

  ionViewDidEnter() {
    this.getUserPosition();
  }

  ngOnInit() {
    this.dealService.getAllDeals().subscribe((res) => {
      this.deals = res;
      console.log(this.deals);
      this.loadDistance();
    });
  }

  getCountDownTime(date: string) {
    let timeRemaining;
    let endDate = new Date(date).getTime();
    let todayDate = new Date().getTime();
    let distance = endDate - todayDate;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (distance < 0) {
      timeRemaining = "Expired";
    } else {
      timeRemaining = days + "d " + hours + "h " + minutes + "m remaining";
    }

    //  console.log(timeRemaining);
    return timeRemaining;
  }

  dealClicked(id) {
    this.router.navigate(["/deal-details"], { queryParams: { id: id } });
  }

  getUserPosition() {
    let options = {
      enableHighAccuracy: true,
    };

    this.geolocation.getCurrentPosition(options).then(
      (pos: Geoposition) => {
        this.currentPos = pos;
      },
      (err: PositionError) => {
        console.log("error : " + err.message);
      }
    );
  }

  loadDistance() {
    let count = 0;
    this.deals.forEach((deal) => {
      this.getDistance(+deal.latitude, +deal.longitude).subscribe(
        (res: any) => {
          count = count + 1;
          if (res.rows[0].elements[0].distance) {
            deal.distance = res.rows[0].elements[0].distance.text.split(
              " km"
            )[0];
          }
          //  deal.distance = res.rows[0].elements[0].distance.text;
          //console.log(deal);
          console.log(deal);
          if (count === this.deals.length) {
            this.loadNearbyDeal();
          }
        }
      );
    });
  }

  getDistance(lat, long) {
    console.log("currentPos", this.currentPos);

    let url =
      "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
      this.currentPos.coords.latitude +
      "," +
      this.currentPos.coords.longitude +
      "&destinations=" +
      lat +
      "," +
      long +
      "&key=AIzaSyDp3E13X9TtHzcIEDFJnHk6z0xpsPWEFrs";
    return this.http.get(url);
  }

  loadNearbyDeal() {
    console.log("loading nearby," + this.deals);

    this.nearbyDeals = this.deals.filter((list: any) => {
      return parseInt(list.distance) < 200;
    });
    console.log(this.nearbyDeals);
  }
}
