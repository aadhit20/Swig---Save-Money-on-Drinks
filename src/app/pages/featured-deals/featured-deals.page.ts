import { Router } from "@angular/router";
import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-featured-deals",
  templateUrl: "./featured-deals.page.html",
  styleUrls: ["./featured-deals.page.scss"],
})
export class FeaturedDealsPage implements OnInit {
  featuredDeals;
  constructor(private dealService: DealsService, private router: Router) {}

  ngOnInit() {
    this.dealService.getAllFeaturedDeals().subscribe((resp: any) => {
      console.log("Working here");
      console.log(resp);
      this.featuredDeals = resp;
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
}
