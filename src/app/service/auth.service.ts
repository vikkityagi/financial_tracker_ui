import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;

  private apiUrl = environment.baseUrl;

  

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn = status;
  }

  setLogout(): void {
    this.loggedIn = false;
    // Optionally clear other details like user profile, etc.
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users/login`, credentials,{observe: 'response'}).pipe(catchError((err: HttpErrorResponse)=>{
      return throwError(()=> err);
    }));
  }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users/register`, user,{observe: 'response'}).pipe(catchError((err:HttpErrorResponse)=>{
      console.error(err);
      return throwError(() => err);
    }));
  }
}
