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
import * as moment from "moment";

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
      this.featuredDeals = this.filterDeals(resp);
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

  filterDeals(list) {
    return list.filter((deal) => {
      return (
        this.getCountDownTime(deal.dealEndTime) !== "Expired" &&
        moment(new Date().toISOString()).isAfter(deal.dealStartTime)
      );
    });
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
      deal.distance = this.getDistance(+deal.latitude, +deal.longitude);
    });
  }

  getDistance(lat2, lon2) {
    let lat1 = this.currentPos.coords.latitude;
    let lon1 = this.currentPos.coords.longitude;
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
