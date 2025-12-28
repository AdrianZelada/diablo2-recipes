import { Component } from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { RunesService } from './services/runes.service';
import { FilterRecipes, ViewRecipes } from './services/interfaces';
import { CardRecipeComponent } from './card-recipe/card-recipe.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CardRecipeComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'd-recipes';
  runes: Array<any>= [];
  mapRunes: any = {};
  recipes: ViewRecipes = {
    main: [],
    suggestions: []
  };
  showStatus: boolean = false;
  selectedTab: string = 'all';
  typesTabs: Array<string> = ['Escudos', 'Cascos', 'Armas', 'Armaduras'];
  typesItems: Array<Array<string>> = [['escudos','escudo'],['cascos'], ['vara','armas','hachas','mazas','cetros','espadas','bastones','martillos','garras','lanzas'], ['armaduras','armadura']];
  index: number = -1;
  constructor(
    private _recipesService: RecipesService,
    private _runesService: RunesService
  ) {
    this._runesService.getData().subscribe((runes) => {
      this.runes = runes;
    });

    this._recipesService.recipesSubject.subscribe((recipes: ViewRecipes) => {
      this.recipes = {
        ...recipes
      }
    });
  }

  selectRune(rune: any) {
    if(this.mapRunes[rune.name]) {
      delete this.mapRunes[rune.name];
    } else {
      this.mapRunes[rune.name] = true;
    }
    const runes = Object.keys(this.mapRunes);
    const filter: FilterRecipes = {
      runes: runes,
      arm: runes.length > 0 ? (this.index == -1 ? [] : this.typesItems[this.index]) : []
    }

    this.showStatus = runes.length > 0;
    this._recipesService.filterRecipes(filter);


  }

  selectTab(tab: string, i: number) {
    this.selectedTab = tab;
    this.index = i;
    const runes = Object.keys(this.mapRunes);
    const filter: FilterRecipes = {
      runes: runes,
      arm: runes.length > 0 ? (i == -1 ? [] : this.typesItems[i]) : this.typesItems[i]
    }
    this._recipesService.filterRecipes(filter);
    this.showStatus = runes.length > 0;
  }

}
