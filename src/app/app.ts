import { Component, signal } from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { RunesService } from './services/runes.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  form: FormGroup;
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
    private _runesService: RunesService,
    private fb :FormBuilder
  ) {
    this.form =  this.fb.group({
      runes: new FormControl()
    })
    this._runesService.getData().subscribe((runes) => {
      this.runes = runes;
    });
    const catalogs = this._recipesService.getCatalogs();

    this._recipesService.recipesSubject.subscribe((recipes: ViewRecipes) => {
      console.log('recipes',recipes);
      this.recipes = {
        ...recipes
      }
    });

    this.form.valueChanges.subscribe((formChanges) => {
      console.log(formChanges);
    })

  }

  filter() {
    const filter: FilterRecipes = {
      runes: ["Tal", "Ral", "Eld", "Nef", "Ith", "El", "Tir", "Eth"],
      arm: []
    }

    // this._recipesService.filterRecipes(filter);
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
      // arm: runes.length > 0 ? this.typesItems[this.index] : []
      arm: runes.length > 0 ? (this.index == -1 ? [] : this.typesItems[this.index]) : []
    }

    this.showStatus = runes.length > 0;
    this._recipesService.filterRecipes(filter);


  }

  selectTab(tab: string, i: number) {
    this.selectedTab = tab;
    // if(tab != 'all') {
      this.index = i;
    // }
    const runes = Object.keys(this.mapRunes);
    const filter: FilterRecipes = {
      runes: runes,
      // arm: runes.length > 0 ? i == -1 ? this.typesItems[this.index] : [] : []
      arm: runes.length > 0 ? (i == -1 ? [] : this.typesItems[i]) : this.typesItems[i]
    }
    this._recipesService.filterRecipes(filter);
    this.showStatus = runes.length > 0;
  }

}
