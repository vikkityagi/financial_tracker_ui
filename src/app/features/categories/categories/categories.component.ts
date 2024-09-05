// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/service/category.service';
import { Category } from '../../models/category.model';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = {
    id: 0,
    name: '',
    description: ''
  };

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesService.getAllCategories()
      .subscribe(
        (categories) => this.categories = categories,
        (error) => console.error('Error fetching categories:', error)
      );
  }

  addCategory(): void {
    this.categoriesService.createCategory(this.newCategory)
      .subscribe(
        (category) => {
          this.categories.push(category);
          this.resetNewCategory();
        },
        (error) => console.error('Error adding category:', error)
      );
  }

  deleteCategory(id: number): void {
    this.categoriesService.deleteCategory(id)
      .subscribe(
        () => this.categories = this.categories.filter(c => c.id !== id),
        (error) => console.error('Error deleting category:', error)
      );
  }

  resetNewCategory(): void {
    this.newCategory = {
      id: 0,
      name: '',
      description: ''
    };
  }
}
