import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { MatTableModule } from '@angular/material/table';
import { TransactionsRoutingModule } from './transactions-routing.module';



@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    MatTableModule
  ]
})
export class TransactionsModule { }
