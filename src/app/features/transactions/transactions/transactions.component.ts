import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoriesService } from 'src/app/service/category.service';
import { SharedService } from 'src/app/service/shared.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactionForm: any = FormGroup;
  authId!: number;
  categories: Category[] = [];
  isAdding: boolean = false;
  transactions: any[] = [];

  constructor(private fb: FormBuilder, private shareService: SharedService, private categoryService: CategoriesService, private router: Router,
    private transactionService: TransactionService,private snackBar: MatSnackBar
  ) {
    this.initForm();
  }


  ngOnInit(): void {
    this.getAuthId();

    if (this.authId > 0) {
      this.getCategories(this.authId);
      this.getTransactions(this.authId);
    } else {
      this.snackBar.open("Authentication issue. Redirecting to login...", "Close", {
        duration: 3000,
      });
      this.router.navigate(['/login']);
    }
  }

  getCategories(loginId: number): void {
    this.categoryService.getCategories(loginId).subscribe({
      next: response => {
        this.categories = response;
      },error: errorRes=>{
        this.snackBar.open("category is not fetched that's why we are redirecting on category page...","close",{
          duration: 3000
        });
        this.router.navigate(['/categories'])
      }
    })
  }




  getAuthId() {
    this.shareService.data$.subscribe({
      next: id => {
        if (id != 0) {
          this.authId = id;
        }
      }
    })
  }

  getTransactions(login_id: number) {
    this.transactionService.getTransactions(login_id).subscribe({
      next: response => {
        if (response.length >= 0) {
          this.transactions = response;
        }
      }
    })
  }


  private initForm() {
    this.transactionForm = this.fb.group({
      id: [''],
      login_id: [''],
      description: ['', [Validators.required]],
      amount: ['',[Validators.required]],
      date: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      type: ['',[Validators.required]]
    })
  }

  public addTransaction() {
    
    if (this.authId > 0) {
      if (this.transactionForm.valid) {
        if (this.transactionForm.get('login_id').value == '' || this.transactionForm.get('id').value == '') {
          this.transactionForm.get('login_id')?.setValue(this.authId+'');
          this.transactionService.addTransaction(this.transactionForm.value).subscribe({
            next: response => {
              const body = response.body;
              if (response.status === 201 && body.id != null && body.login_id === this.authId) {
                this.resetForm();
                this.snackBar.open('Transaction added successfully.', 'Close', { duration: 3000 });
                this.getTransactions(this.authId);
              }
            }, error: errorRes => {
              alert(errorRes.message);
            }
          })
        } else {
          //  update code write here
          this.transactionService.updateTransaction(this.transactionForm.value).subscribe({
            next: response => {
              const body = response.body;
              const login_id = this.transactionForm.get('login_id').value;
              if (response.status === 200 && body.id != null && body.login_id+'' === login_id) {
                this.snackBar.open('Transaction updated successfully', 'Close', {
                  duration: 3000,
                });
                this.resetForm();
                this.getTransactions(login_id);
              }
            }, error: errorRes => {
              alert(errorRes.message);
            }
          })

        }
      } else {
        this.transactionForm.markAllAsTouched(); // Highlight invalid fields
        this.snackBar.open('Please check the complete form.', 'Close', { duration: 3000 });
      }
    } else {
      this.snackBar.open("Authentication issue. Redirecting to login...", "Close", {
        duration: 3000,
      });
      this.router.navigate(['/login']);
    }

  }

  public toggleAdd() {
    this.isAdding = !this.isAdding;
    if(!this.isAdding){
      this.resetForm();
    }
  }

  public edit(transaction: any) {
    if (transaction != null) {
      this.loadFormWithValue(transaction);
    }
  }

  public delete(transaction: any) {
    if (confirm(`Are you sure you want to delete transaction ID ${transaction.id}?`)) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: res => {
          this.snackBar.open(`Transaction ID ${transaction.id} deleted.`, 'Close', { duration: 3000 });
          this.getTransactions(transaction.login_id);
          // this is for, to click on edit icon to fetch the detail. after this you delete the same id but data is already fetched so i want to reset the data
          this.resetForm();
        },
        error: err => {
          this.snackBar.open(`Error deleting transaction: ${err.message}`, 'Close', { duration: 3000 });
        }
      });
    }
  }

  private loadFormWithValue(data: any) {
    this.transactionForm.patchValue({
      id: data.id.toString(),
      login_id: data.login_id.toString(),
      description: data.description.toString(),
      amount: data.amount.toString(),
      date: data.date.toString(),
      category_id: data.category_id.toString(),
      type: data.type.toString()
    })
  }

  displayedColumns: string[] = ['id', 'description', 'amount', 'date', 'type', 'created_at', 'updated_at', 'action'];




  private resetForm() {
    Object.keys(this.transactionForm.controls).forEach((key) => {
      const control = this.transactionForm.controls[key];
      control?.setValue('');
      control.markAsPristine();
      control.markAsUntouched();
      
  });
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.transactionForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}