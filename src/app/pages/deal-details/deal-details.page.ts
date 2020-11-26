import { LoadingController } from "@ionic/angular";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-deal-details",
  templateUrl: "./deal-details.page.html",
  styleUrls: ["./deal-details.page.scss"],
})
export class DealDetailsPage implements OnInit {
  dealDetails: any = {};
  constructor(
    private route: ActivatedRoute,
    private dealService: DealsService,
    private loadingCtrl: LoadingController,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.dealService.getDealDetails(res["id"]).subscribe(
          (resp) => {
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
    this.location.back();
  }
}
