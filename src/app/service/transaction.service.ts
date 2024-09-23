import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  

  getTransactions(login_id: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/v2/transactions/${login_id}`).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=> err);
    }));
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v2/transactions`, transaction, {observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=>err);
    }));
  }

  updateTransaction(transaction: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/v2/transactions`, transaction, {observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=>err);
    }));
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/v2/transactions/${id}`, {observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=>err);
    }));
  }
}
