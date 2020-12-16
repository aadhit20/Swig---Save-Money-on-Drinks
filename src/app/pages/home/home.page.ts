import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import { from, Subscription, timer } from "rxjs";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
  PositionError,
} from "@ionic-native/geolocation/ngx";
import { HttpClient } from "@angular/common/http";
import { LocationService } from "src/app/shared/services/location.service";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";

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
  constructor(
    private dealService: DealsService,
    private router: Router,
    private geolocation: Geolocation,
    private http: HttpClient,
    private locationService: LocationService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {}

  ngOnInit() {
    this.dealSubscription = this.dealService.getAllDeals().subscribe((res) => {
      this.deals = this.filterDeals(res);
      this.checkGPSPermission();
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
      return this.getCountDownTime(deal.dealEndTime) !== "Expired";
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
          this.currentPos = pos;
          this.loadDistance();
        },
        async (err: PositionError) => {
          //         alert(JSON.stringify(err));
          //   const alert = await this.alertController.create({
          //   header: "Warning",
          //   message:
          //     "Couldn't get your location, Please check your location permission and services",
          //   buttons: ["Okay"],
          // });
          // alert.present();
          console.log("error : " + err.message);
        }
      )
      .catch((err) => {
        //    alert(JSON.stringify(err));
      });
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
          this.getUserPosition();
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        (error) =>
          alert(
            "Error requesting location permissions " + JSON.stringify(error)
          )
      );
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
      "&key=AIzaSyAOrz9tpau_NSZwVdVDvv0kEMbeZHtkLUE";
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
