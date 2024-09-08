// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserProfile } from '../features/models/profile.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(id: number): Observable<HttpResponse<UserProfile>> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/users/${id}`,{observe: 'response'}).pipe(catchError((err:HttpErrorResponse)=>{
      return throwError(()=>err)
    }))
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profile);
  }
}
