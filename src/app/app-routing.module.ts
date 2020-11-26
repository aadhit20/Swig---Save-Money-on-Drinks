import { HomeGuard } from "./pages/home/home.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./pages/signup/signup.module").then((m) => m.SignupPageModule),
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./pages/forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
    canActivate: [HomeGuard],
  },
  {
    path: "featured-deals",
    loadChildren: () =>
      import("./pages/featured-deals/featured-deals.module").then(
        (m) => m.FeaturedDealsPageModule
      ),
  },
  {
    path: "search",
    loadChildren: () =>
      import("./pages/search/search.module").then((m) => m.SearchPageModule),
  },
  {
    path: "list-details",
    loadChildren: () =>
      import("./pages/list-details/list-details.module").then(
        (m) => m.ListDetailsPageModule
      ),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    path: "edit-profile",
    loadChildren: () =>
      import("./pages/edit-profile/edit-profile.module").then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: "contact-us",
    loadChildren: () =>
      import("./pages/contact-us/contact-us.module").then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: "invite-friends",
    loadChildren: () =>
      import("./pages/invite-friends/invite-friends.module").then(
        (m) => m.InviteFriendsPageModule
      ),
  },
  {
    path: "coming-soon",
    loadChildren: () =>
      import("./pages/coming-soon/coming-soon.module").then(
        (m) => m.ComingSoonPageModule
      ),
  },
  {
    path: 'deal-details',
    loadChildren: () => import('./pages/deal-details/deal-details.module').then( m => m.DealDetailsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
