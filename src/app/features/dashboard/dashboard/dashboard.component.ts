import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { CategoriesService } from 'src/app/service/category.service';
import { SharedService } from 'src/app/service/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalBalance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  recentTransactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'description', 'amount'];
  authId!: number;

  // Highcharts setup
  Highcharts: typeof Highcharts = Highcharts; // Required for Highcharts
  categoryChartOptions: Highcharts.Options = {}; // Chart configuration

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private transactionService: TransactionService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.getAuthId();
    if (this.authId != 0) {
      this.loadDashboardData(this.authId);
    } else {
      alert('Please login again...');
      this.router.navigate(['/login']);
    }
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

  loadDashboardData(login_id: number): void {
    this.transactionService.getTransactions(login_id).subscribe((transactions) => {
      this.calculateTotals(transactions);
      this.recentTransactions = transactions.slice(0, 5); // Display the latest 5 transactions

      // Load category breakdown
      if (this.authId != 0) {
        this.loadCategoryBreakdown(this.authId);
      } else {
        alert('Please login again...');
        this.router.navigate(['/login']);
      }
    });
  }

  calculateTotals(transactions: Transaction[]): void {
    this.totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  loadCategoryBreakdown(login_id: number): void {
    this.categoryService.getCategories(login_id).subscribe((categories) => {
      const categoryNames = categories.map((category: any) => category.name);
      const categoryAmounts = categories.map((category: any) => {
        return this.recentTransactions
          .filter((transaction) => transaction.category_id === category.id)
          .reduce((acc, transaction) => acc + transaction.amount, 0);
      });
  
      // Set real data for chart
      this.categoryChartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Category Breakdown'
        },
        series: [{
          name: 'Amount',
          type: 'pie',
          data: categoryNames.map((name: any, index: string | number) => ({
            name: name,
            y: categoryAmounts[index] || 0
          }))
        }]
      };
    });
  }
  



}
