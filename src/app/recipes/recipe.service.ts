import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Tasty Schnitzel',
            'A super-tasty Schnitzel - just awesome!',
            'https://st2.depositphotos.com/3394061/5904/i/950/depositphotos_59047843-stock-photo-schnitzel-with-french-fries-and.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20),
            ]
        ),
        new Recipe(
            'Big Fat Burger',
            'What else you need to say',
            'https://media-cdn.tripadvisor.com/media/photo-s/05/33/d4/53/the-loft.jpg',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1),
            ]
        ),

    ];

    constructor(private slService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
}