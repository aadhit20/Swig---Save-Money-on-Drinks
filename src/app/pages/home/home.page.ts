import { AlertController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {
  Geolocation,
  Geoposition,
  PositionError,
} from "@ionic-native/geolocation/ngx";
import { HttpClient } from "@angular/common/http";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import * as moment from "moment";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  dealSubscription: Subscription;
  deals = [];
  nearbyDeals = [];
  featuredDeals = [];
  currentPos;
  errorText = "No nearby deals found";
  constructor(
    private dealService: DealsService,
    private router: Router,
    private geolocation: Geolocation,
    private http: HttpClient,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  ionViewWillEnter() {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkGPSPermission();
    });
    this.dealSubscription = this.dealService
      .getAllDeals()
      .subscribe(async (res) => {
        this.deals = await this.filterDeals(res);
        this.getUserPosition();
      });
    this.dealService.getAllFeaturedDeals().subscribe((res) => {
      this.featuredDeals = this.filterDeals(res);
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
    this.geolocation
      .getCurrentPosition(options)
      .then(
        (pos: Geoposition) => {
          this.errorText = "No nearby deals found";
          this.currentPos = pos;
          console.log(pos);
          this.loadDistance();
        },
        async (err: PositionError) => {
          this.errorText = "Couldn't get your location";
          console.log("error : " + err.message);
        }
      )
      .catch((err) => {
        this.errorText = "Couldn't get your location";
        //    alert(JSON.stringify(err));
      });
  }

  loadDistance() {
    let count = 0;
    this.deals.forEach((deal) => {
      deal.distance = this.getDistance(+deal.latitude, +deal.longitude);
      count = count + 1;
      if (count === this.deals.length) {
        this.loadNearbyDeal();
      }
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
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  loadNearbyDeal() {
    this.nearbyDeals = this.deals.filter((list: any) => {
      return parseInt(list.distance) < 500;
    });
  }

  public checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          console.log(result, "home");

          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        async (err) => {
          const alert = await this.alertController.create({
            header: "Warning",
            message: "Please enable location permissions to continue",
            buttons: ["Okay"],
          });
          alert.present();
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert(
                "requestPermission Error requesting location permissions " +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // this.getUserPosition();
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        (error) =>
          alert(
            "Error requesting location permissions " + JSON.stringify(error)
          )
      );
  }
}
