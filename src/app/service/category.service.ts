// categories.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../features/models/category.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCategories(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/api/v1/categories/${id}`).pipe(catchError((err : HttpErrorResponse)=>{
      return throwError(()=> err);
    }));
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/api/v1/category/${id}`).pipe(catchError((err : HttpErrorResponse)=>{
      return throwError(()=> err);
    }));
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post<Category>(`${this.apiUrl}/api/v1/categories`, category, {observe: 'response'}).pipe(catchError((err : HttpErrorResponse)=>{
      return throwError(()=> err);
    }))
  }

  updateCategory(category: Category): Observable<any>{
    return this.http.put(`${this.apiUrl}/api/v1/category`,category,{observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=> err)
    }))
  }

  

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/category/${id}`);
  }

}
