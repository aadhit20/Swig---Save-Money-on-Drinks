import { DealsService } from "./../../shared/services/deals.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  deals = [];
  dealsUnfiltered = [];
  searchName;

  constructor(private router: Router, private dealService: DealsService) {}

  ngOnInit() {
    this.dealService.getAllDeals().subscribe((res) => {
      this.deals = this.filterDeals(res);
      this.dealsUnfiltered = this.deals;
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
      timeRemaining = days + "d " + hours + "h " + minutes + "m";
    }

    //  console.log(timeRemaining);
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

  search() {
    this.resetChanges();
    if (!(this.searchName === "")) {
      const searchResult = this.deals.filter((currentList) => {
        if (currentList.title && this.searchName) {
          return (
            currentList.title
              .toLowerCase()
              .indexOf(this.searchName.toLowerCase()) > -1
          );
        }
      });
      this.deals = searchResult;
    }
  }

  resetChanges() {
    this.deals = this.dealsUnfiltered;
  }
}
