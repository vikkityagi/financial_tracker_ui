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

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/transactions`, transaction, {observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=>err);
    }));
  }
}
