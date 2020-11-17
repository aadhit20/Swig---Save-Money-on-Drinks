import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturedDealsPage } from './featured-deals.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedDealsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturedDealsPageRoutingModule {}
