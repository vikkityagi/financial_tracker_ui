import { Component, Inject, inject } from '@angular/core';
import {  MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  styleUrls: ['./snack-bar.component.css'],
  templateUrl: './snack-bar.component.html',
})
export class SnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}

}
