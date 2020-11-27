import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-show-direction",
  templateUrl: "./show-direction.page.html",
  styleUrls: ["./show-direction.page.scss"],
})
export class ShowDirectionPage implements OnInit, AfterViewInit {
  google;
  @ViewChild("map") mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  currentLocation: any = {
    lat: 5.9774,
    lng: 80.4288,
  };

  constructor() {}
  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: { lat: 5.9774, lng: 80.4288 },
    });
    this.directionsDisplay.setMap(map);
    let x = {
      lat: 6.0535,
      lng: 80.221,
    };
    this.calculateAndDisplayRoute(x);
  }

  ngOnInit() {}

  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route(
      {
        origin: this.currentLocation,
        destination: "6.0535,80.221",
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          that.directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}
