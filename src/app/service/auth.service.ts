import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.baseUrl;

  

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users/register`, user,{observe: 'response'}).pipe(catchError((err:HttpErrorResponse)=>{
      console.error(err);
      return throwError(() => err);
    }));
  }
}
