import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  // Create a BehaviorSubject with an initial value
  private dataSubject = new BehaviorSubject<any>(0);
  
  // Expose the data as an observable
  data$ = this.dataSubject.asObservable();

  // Method to update the data
  updateData(newValue: string) {
    this.dataSubject.next(newValue);
  }
}
