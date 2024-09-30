import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import * as Highcharts from 'highcharts';
import { SharedService } from 'src/app/service/shared.service';
import { TransactionService } from 'src/app/service/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalBalance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  recentTransactions: any[] = [];
  displayedColumns: string[] = ['date', 'description', 'amount'];
  Highcharts: typeof Highcharts = Highcharts;
  categoryChartOptions: Highcharts.Options = {};
  authId!: number;

  constructor(private router: Router,private snackbar: MatSnackBar,private sharedService: SharedService,private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getAuthId();
    this.fetchTransactions();
    this.calculateSummary();
    this.setupCategoryChart();

  }

  getAuthId() {
    this.sharedService.data$.subscribe({
      next: (id) => {
        if (id != 0) {
          this.authId = id;
        }
      }
    });
  }

  fetchTransactions(): void {
    if(this.authId > 0){
      this.transactionService.getTransactions(this.authId).subscribe((transactions: any[]) => {
        this.recentTransactions = transactions;
      });
    }else{
      this.snackbar.open("Authentication Error...so we are redirecting on login page","close",{
        duration: 3000
      });
      this.router.navigate(['/login']);
    }
    
  }

  calculateSummary(): void {
    if(this.authId > 0){
      this.transactionService.getTransactions(this.authId).subscribe((transactions: any[]) => {
        this.totalIncome = transactions
          .filter((t: { type: string; }) => t.type === 'income')
          .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
  
        this.totalExpenses = transactions
          .filter((t: { type: string; }) => t.type === 'expense')
          .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
  
        this.totalBalance = this.totalIncome - this.totalExpenses; // Ensure correct calculation
      });
    }else{
      this.snackbar.open("Authentication Error...so we are redirecting on login page","close",{
        duration: 3000
      });
      this.router.navigate(['/login']);
    }
    
  }

  setupCategoryChart(): void {
    // Initialize your Highcharts options here
    this.categoryChartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Category Breakdown',
      },
      series: [
        {
          name: 'Amount',
          data: [
            // Example data
            { name: 'Salary', y: this.totalIncome },
            { name: 'Rent', y: this.totalExpenses * 0.3 },
            { name: 'Groceries', y: this.totalExpenses * 0.2 },
            // Add more categories as needed
          ],
          type: 'pie',
        },
      ],
    };
  }
}
