import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardModule,
    TransactionsModule,
    AuthModule
  ]
})
export class FeaturesModule { }
