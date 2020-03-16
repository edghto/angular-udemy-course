import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('Test recipe', 'Test', 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2017/12/Vegetable-stew-recipe-920x605.jpg'),
    new Recipe('Another recipe', 'Test', 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2017/12/Vegetable-stew-recipe-920x605.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

}
