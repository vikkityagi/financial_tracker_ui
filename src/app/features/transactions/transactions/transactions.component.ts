import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoriesService } from 'src/app/service/category.service';
import { SharedService } from 'src/app/service/shared.service';
import { Router } from '@angular/router';


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

  constructor(private fb:FormBuilder,private shareService: SharedService,private categoryService: CategoriesService,private router: Router,
    private transactionService: TransactionService
  ){
    this.initForm();
  }


  ngOnInit(): void {
    this.getAuthId();

    if(this.authId > 0){
      this.getCategories(this.authId);
      this.getTransactions(this.authId);
    }else{
      alert("sorry something is wrong there, so we are redirect on login page...");
      this.router.navigate(['/login']);
    }
  }

  getCategories(loginId: number): void {
    this.categoryService.getCategories(loginId).subscribe({
      next: response=>{
        this.categories = response;
      }
    })
  }

  


  getAuthId(){
    this.shareService.data$.subscribe({
      next: id=>{
        if(id != 0){
          this.authId = id;
        }
      }
    })
  }

  getTransactions(login_id: number){
    this.transactionService.getTransactions(login_id).subscribe({
      next: response=>{
        if(response.length>0){
          this.transactions = response;
        }
      }
    })
  }


  private initForm(){
    this.transactionForm = this.fb.group({
      id: [''],
      login_id: [0,Validators.required],
      description: ['',[Validators.required]],
      amount: [[Validators.required]],
      date: ['',[Validators.required]],
      category_id: ['',[Validators.required]],
    })
  }

  public addTransaction(){

    if(this.authId > 0){
      if(this.transactionForm.valid){
        if(this.transactionForm.get('login_id').value == 0 && this.transactionForm.get('id').value == ''){
          this.transactionForm.get('login_id')?.setValue(this.authId);
          this.transactionService.addTransaction(this.transactionForm.value).subscribe({
            next: response=>{
              const body = response.body;
              if(response.status === 201 && body.id != null && body.login_id === this.authId){
                this.transactionForm.reset();
                alert('Form submit successfully');
                this.getTransactions(this.authId);
              }
            },error: errorRes=>{
              alert(errorRes.message);
            }
          })
        }else{
          //  update code write here
          this.transactionService.updateTransaction(this.transactionForm.value).subscribe({
            next: response=>{
              const body = response.body;
              const login_id = this.transactionForm.get('login_id').value;
              if(response.status === 200 && body.id != null && body.login_id === login_id){
                this.transactionForm.reset();
                alert('Form upated successfully');
                this.getTransactions(login_id);
              }
            },error: errorRes=>{
              alert(errorRes.message);
            }
          })
          
        }
      }else{
        alert('please check the complete form..');
      }
    }else{
      alert("sorry something is wrong there, so we are redirect on login page...");
      this.router.navigate(['/login']);
    }

  }

  public toggleAdd(){
    this.isAdding = !this.isAdding;
  }

  public edit(transaction: any){
    if(transaction != null){
      this.loadFormWithValue(transaction);
    }
  }

  public delete(transaction: any){
    this.transactionService.deleteTransaction(transaction.id);
    this.getTransactions(transaction.login_id);
  }

  private loadFormWithValue(data: any){
    this.transactionForm.get('id')?.setValue(data.id);
    this.transactionForm.get('login_id')?.setValue(data.login_id);
    this.transactionForm.get('description')?.setValue(data.description);
    this.transactionForm.get('amount')?.setValue(data.amount);
    this.transactionForm.get('date')?.setValue(data.date);
    this.transactionForm.get('category_id')?.setValue(data.category_id);
  }

  displayedColumns: string[] = ['id', 'description', 'amount', 'date','action']; 
  
}
