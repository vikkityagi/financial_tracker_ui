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
  dataSource: any[] = [];

  constructor(private fb:FormBuilder,private shareService: SharedService,private categoryService: CategoriesService,private router: Router,
    private transactionService: TransactionService
  ){
    this.initForm();
  }


  ngOnInit(): void {
    this.getAuthId();

    if(this.authId > 0){
      this.getCategories(this.authId);
    }else{
      alert("sorry something is wrong there, so we are redirect on login page...");
      // this.router.navigate(['/login']);
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


  private initForm(){
    this.transactionForm = this.fb.group({
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
        if(this.transactionForm.get('login_id').value == 0){
          this.transactionForm.get('login_id')?.setValue(this.authId);
          this.transactionService.addTransaction(this.transactionForm.value).subscribe({
            next: response=>{
              const body = response.body;
              if(response.status === 201 && body.id != null && body.login_id === this.authId){
                this.transactionForm.reset();
                alert('Form submit successfully')
              }
            },error: errorRes=>{
              alert(errorRes.message);
            }
          })
        }else{
          //  update code write here
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

  displayedColumns: string[] = ['id', 'description', 'amount', 'date']; 
  
}
