import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from '../../models/transaction.model';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  displayedColumns: string[] = ['id', 'description', 'amount', 'date']; 
  dataSource = new MatTableDataSource<Transaction>();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.dataSource.data = transactions;
    });
  }
}
