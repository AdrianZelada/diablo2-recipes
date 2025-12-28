import { Injectable } from '@angular/core';
import { uniq } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { Catalogs, FilterRecipes, ViewRecipes } from './interfaces';
import { RECIPES } from '../../stores/recipes';

@Injectable({providedIn: 'root'})
export class RecipesService {
  private typesItems: Array<Array<string>> = [['escudos','escudo'],['cascos'], ['vara','armas','hachas','mazas','cetros','espadas','bastones','martillos','garras','lanzas','armas cuerpo a cuerpo'], ['armaduras','armadura']];
  public recipes: ViewRecipes = {main: RECIPES, suggestions: []};
  private _recipesSubject: BehaviorSubject<ViewRecipes> = new BehaviorSubject(this.recipes);
  public recipesSubject: Observable<ViewRecipes> = this._recipesSubject.asObservable();
  constructor() {
  }

  getCatalogs(): Catalogs {
    const catalogs: Catalogs = RECIPES.reduce((result: Catalogs, item: any) => {
      return {
        arm: [...result.arm, ...item.arm],
        holes: [...result.holes, item.holes]
      }
    }, {arm:[], holes: []});

    return {
      arm: uniq(catalogs.arm),
      holes: uniq(catalogs.holes)
    };
  }

  filterRecipes(filter: FilterRecipes) {
    if(filter.runes?.length == 0 && filter.arm?.length == 0 && filter.holes == null) {
      this._recipesSubject.next(this.recipes);
    } else {
      const recipes: ViewRecipes =  {
        main: [],
        suggestions: []
      }
      RECIPES.forEach((recipe: any) => {
        const runeFilter = this.filterRune(filter.runes || [], recipe.runes);
        const armFilter = this.filterArm(filter.arm || [], recipe.arm);
        const holeFilter = this.filterHoles(filter.holes || 0, recipe.holes);
        if(runeFilter.isMain && armFilter.isMain && holeFilter.isMain) {
          recipes.main.push(
            {
              ...recipe,
              runes: [
                ...runeFilter.runes
              ]
            }
          )
        } else {
          // if(runeFilter.count >= 1 && ( armFilter.isMain || holeFilter.isMain)) {
          if(runeFilter.count >= 1 && armFilter.isMain ) {
            recipes.suggestions.push(
              {
                ...recipe,
                runes: [
                  ...runeFilter.runes
                ]
              }
            )
          }
        }
      });

      recipes.main = recipes.main.sort((a: any, b: any) => a.holes - b.holes);
      recipes.suggestions = recipes.suggestions.sort((a: any, b: any) => a.holes - b.holes);
      this._recipesSubject.next(recipes);
    }
  }


  filterRune(runes: Array<string>, runeRecipe: Array<any>) {
    let count: number = 0;
    const statusRunes = runeRecipe.map((rune: any) => {
      const status = runes.length == 0 ? true : runes.indexOf(rune.name) != -1;
      count = count + (status? 1: 0);
      return {
        ...rune,
        status: runes.indexOf(rune.name) != -1
      }
    });
    return {
      runes: [
        ...statusRunes
      ],
      isMain: runeRecipe.length == count,
      count
    }
  }

  filterArm(arm: Array<string>, armRecipe: Array<string>) {
    const status = arm.length == 0 ? true : armRecipe.some((armItem: string) => arm.some((armItemFilter: string) => {
      return armItem.toLowerCase().indexOf(armItemFilter.toLowerCase()) != -1;
    }));
    return {
      isMain: status
    }
  }

  filterHoles(n: number, holesRecipe: number) {
    return {
      isMain: n == 0 ? true : holesRecipe == n
    }
  }

}
