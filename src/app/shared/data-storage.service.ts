import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class DataStorageService {
    private static readonly API_BASE = 'https://ng-course-recipe-book-680d6.firebaseio.com';

    constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        this.http.put(
            DataStorageService.API_BASE + '/recipes.json',
            this.recipesService.getRecipes()
        ).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
            DataStorageService.API_BASE + '/recipes.json').pipe(
                map(recipes => {
                    return recipes.map((recipe: Recipe) => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    });
                }),
                tap(recipes => {
                    console.log(recipes);
                    this.recipesService.setRecipes(recipes);
                })
            );
    }
}