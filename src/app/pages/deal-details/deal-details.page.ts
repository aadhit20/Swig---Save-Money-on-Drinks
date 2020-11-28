import { LoadingController } from "@ionic/angular";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
declare var google;
@Component({
  selector: "app-deal-details",
  templateUrl: "./deal-details.page.html",
  styleUrls: ["./deal-details.page.scss"],
})
export class DealDetailsPage implements OnInit {
  dealDetails: any = {};
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  constructor(
    private route: ActivatedRoute,
    private dealService: DealsService,
    private loadingCtrl: LoadingController,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.dealService.getDealDetails(res["id"]).subscribe(
          (resp) => {
            this.addMap(+resp.latitude, +resp.longitude);
            console.log(+resp.latitude, +resp.longitude);

            loadingEl.dismiss();
            this.dealDetails = resp;
            console.log(this.dealDetails);
          },
          (err) => {
            loadingEl.dismiss();
          }
        );
      });
    });
  }

  back() {
    this.router.navigate(["/tabs/home"]);
  }

  addMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content,
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  showDirections() {
    this.router.navigate(["/show-direction"], {
      queryParams: {
        lat: +this.dealDetails.latitude,
        lng: +this.dealDetails.longitude,
      },
    });
  }
}
