import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Category } from '../../models/category.model';
import { CategoriesService } from 'src/app/service/category.service';
import { SharedService } from 'src/app/service/shared.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isAdding: boolean = false;
  newCategory: Category = {
    id: 0, name: '',
    description: '',
    loginId: 0,
  };
  authId!: number;
  categoryData : Category = {
    id: 0,
    name: '',
    description: '',
    loginId: 0
  };

  constructor(private snackbar: MatSnackBar,private categoryService: CategoriesService,private shareService: SharedService,private router: Router) {}

  ngOnInit(): void {
    this.getAuthId();
    if(this.authId != 0)
      this.getCategories(this.authId);
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

  getCategory(id: number){
    this.categoryService.getCategoryById(id).subscribe({
      next: data=>{
        if(data.length < 1){
          this.snackbar.open("I think we don't have a category so please create a category!!!","close",{
            duration: 3000
          })
        }else{
          this.categoryData = data;
        }
        
      },error: errorResponse=>{
        this.snackbar.open("I think we don't have a category so please create a category!!!","close",{
          duration: 3000
        })
      }
    })
  }

  getCategories(loginId: number): void {
    this.categoryService.getCategories(loginId).subscribe({
      next: response=>{
        this.categories = response;
      },error:err=>{
        this.snackbar.open("I think we don't have a category so please create a category, or it is the server issue","close",{
          duration: 3000
        });
        this.toggleAdd();
      }
    })
  }

  addCategory(): void {
    if(this.authId != 0){
      if(this.newCategory.id == 0){
        this.newCategory.loginId = this.authId;
        this.categoryService.addCategory(this.newCategory).subscribe({
          next: response=>{
            const body = response.body;
            if(response.status === 201 && (body.id != undefined || body.id != null)){
              alert("category add Successfully");
              this.refreshForm();
              this.getCategories(body.loginId);
              this.toggleAdd();
            }else if(response.status === 200){
              alert("");
            }
          },
          error: errorRes=>{
            alert(errorRes.message);
          }
        })
      }else{
        this.categoryService.updateCategory(this.newCategory).subscribe({
          next: response=>{
            const body = response.body;
            if(response.status === 201 && (body.id != undefined || body.id != null)){
              alert("category update Successfully");
              this.refreshForm();
              this.getCategories(body.loginId);
              this.toggleAdd();
            }else if(response.status === 200){
              alert("");
            }
          },
          error: errorRes=>{
            alert(errorRes.message);
          }
        })
      }
      
    }else{
      alert("Form Data is not saving, so you will redirect on login page again! please try again...")
      this.router.navigate(['/login'])
    }
     
  }

  editCategory(category: Category): void {
    // Implement edit functionality here
    this.newCategory = category;
    
  }

  deleteCategory(category: any): void {
    // this.categoryService.deleteCategory(ca)
    //   .subscribe(
    //     () => this.categories = this.categories.filter(cat => cat.id !== id),
    //     (error) => console.error('Error deleting category:', error)
    //   );

      this.categoryService.deleteCategory(category.id).subscribe({
        next: data=>{
          alert("delete done...");
          this.getCategories(category.loginId);
        }
      })
  }

  refreshForm(){
    this.newCategory = {
      id: 0, name: '',
      description: '',
      loginId: 0
    };
  }

  toggleAdd(): void {
    this.isAdding = !this.isAdding;
  }

  displayedColumns: string[] = ['id', 'name', 'desc', 'action'];
}
