import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturedDealsPageRoutingModule } from './featured-deals-routing.module';

import { FeaturedDealsPage } from './featured-deals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeaturedDealsPageRoutingModule
  ],
  declarations: [FeaturedDealsPage]
})
export class FeaturedDealsPageModule {}
