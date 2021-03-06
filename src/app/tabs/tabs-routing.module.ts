import { HomeGuard } from "./../pages/home/home.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../pages/home/home.module").then((m) => m.HomePageModule),
        canActivate: [HomeGuard],
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../pages/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: "featured-deals",
        loadChildren: () =>
          import("../pages/featured-deals/featured-deals.module").then(
            (m) => m.FeaturedDealsPageModule
          ),
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
