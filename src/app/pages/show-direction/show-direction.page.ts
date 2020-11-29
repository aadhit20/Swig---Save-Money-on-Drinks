import { AlertController } from "@ionic/angular";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Route } from "@angular/compiler/src/core";
import { ActivatedRoute } from "@angular/router";
declare var google;
@Component({
  selector: "app-show-direction",
  templateUrl: "./show-direction.page.html",
  styleUrls: ["./show-direction.page.scss"],
})
export class ShowDirectionPage implements OnInit, AfterViewInit {
  @ViewChild("map") mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  currentLocation: any = {
    lat: 5.9774,
    lng: 80.4288,
  };
  destinationLat;
  destinationLng;
  map;
  constructor(
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.destinationLat = params["lat"];
      this.destinationLng = params["lng"];

      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 7,
      });
      this.directionsDisplay.setMap(this.map);

      this.getUserPosition();
    });
  }

  ngOnInit() {}

  calculateAndDisplayRoute() {
    const that = this;
    this.directionsService.route(
      {
        origin: this.currentLocation,
        destination: +this.destinationLat + "," + +this.destinationLng,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          that.directionsDisplay.setDirections(response);
          this.makeMarker();
        } else {
          alert("Directions request failed due to " + status);
        }
      }
    );
  }

  getUserPosition() {
    let options = {
      enableHighAccuracy: true,
    };

    this.geolocation
      .getCurrentPosition(options)
      .then(
        (pos: Geoposition) => {
          this.currentLocation.lat = pos.coords.latitude;
          this.currentLocation.lng = pos.coords.longitude;
          this.calculateAndDisplayRoute();
        },
        async (err: PositionError) => {
          const alert = await this.alertCtrl.create({
            header: "Error",
            message: "Couldn't find location",
            buttons: ["Okay"],
          });
          await alert.present();
          console.log("error : " + err.message);
        }
      )
      .catch(async (err) => {
        const alert = await this.alertCtrl.create({
          header: "Error",
          message: "Couldn't find location",
          buttons: ["Okay"],
        });
        await alert.present();
      });
  }
  start;
  destination;
  makeMarker() {
    // this.start = new google.maps.Marker({
    //   position: +this.currentLocation.lat + "," + +this.currentLocation.lng,
    //   map: this.map,
    // });
    // this.destination = new google.maps.Marker({
    //   position: +this.destinationLat + "," + +this.destinationLng,
    //   map: this.map,
    //   title: "Test des",
    // });
  }
}
