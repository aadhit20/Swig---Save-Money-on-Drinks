import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowDirectionPage } from './show-direction.page';

const routes: Routes = [
  {
    path: '',
    component: ShowDirectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowDirectionPageRoutingModule {}
