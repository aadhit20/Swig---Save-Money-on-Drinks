import { DealsService } from "./../../shared/services/deals.service";
import { Component, OnInit } from "@angular/core";
import { timer } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  deals = [];
  constructor(private dealService: DealsService) {}

  ngOnInit() {
    this.dealService.getAllDeals().subscribe((res) => {
      this.deals = res;
      console.log(this.deals);
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

    console.log(timeRemaining);
    return timeRemaining;
  }
}
