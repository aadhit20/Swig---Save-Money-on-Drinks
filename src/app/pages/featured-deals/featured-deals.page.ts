import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
  PositionError,
} from "@ionic-native/geolocation/ngx";
@Component({
  selector: "app-featured-deals",
  templateUrl: "./featured-deals.page.html",
  styleUrls: ["./featured-deals.page.scss"],
})
export class FeaturedDealsPage implements OnInit {
  featuredDeals;
  currentPos;
  constructor(
    private dealService: DealsService,
    private router: Router,
    private http: HttpClient,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.dealService.getAllDeals().subscribe((resp: any) => {
      console.log("Working here");
      console.log(resp);
      this.featuredDeals = resp;
      this.getUserPosition();
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
      timeRemaining = days + "d " + hours + "h " + minutes + "m ";
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
        this.loadDistance();
      },
      (err: PositionError) => {
        console.log("error : " + err.message);
      }
    );
  }

  loadDistance() {
    this.featuredDeals.forEach((deal) => {
      this.getDistance(+deal.latitude, +deal.longitude).subscribe(
        (res: any) => {
          console.log(res);

          if (res.rows[0].elements[0].distance) {
            deal.distance = res.rows[0].elements[0].distance.text;
          }
          console.log(deal);
        }
      );
    });
  }

  getDistance(lat, long) {
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
}
