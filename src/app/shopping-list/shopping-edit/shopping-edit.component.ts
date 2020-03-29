import { Component, Output, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputReference: ElementRef;
  @ViewChild('amountInput') amountInputReference: ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddItem(): void {
    const ingredient = new Ingredient(
      this.nameInputReference.nativeElement.value,
      this.amountInputReference.nativeElement.value,
    );
    this.ingredientAdded.emit(ingredient);
  }
}
