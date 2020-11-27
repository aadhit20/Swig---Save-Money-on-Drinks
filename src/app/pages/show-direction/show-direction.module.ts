import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowDirectionPageRoutingModule } from './show-direction-routing.module';

import { ShowDirectionPage } from './show-direction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowDirectionPageRoutingModule
  ],
  declarations: [ShowDirectionPage]
})
export class ShowDirectionPageModule {}
