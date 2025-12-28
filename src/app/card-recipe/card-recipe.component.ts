import { Component, computed, input, Input, OnInit } from '@angular/core';
import { RunesService } from '../services/runes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'd-card-recipe',
  templateUrl: './card-recipe.component.html',
  styleUrls: ['./card-recipe.component.scss'],
  imports: [CommonModule]
})
export class CardRecipeComponent {

  // @Input() recipe: any = {};

  recipe = input<any>({});
  @Input() showStatus: boolean = false;
  // listRunes: Array<any> = [];
  listRunes = computed(() => {
    return this.recipe().runes?.map((item: any) => {
      return {
        ...item,
        img: this._runesService.buildNameImage(item.name)
      }
    }) || [];
  });

  // arms: string = '';

  arms = computed(() => {
    return this.recipe().arm?.join(', ') || '';
  });

  constructor(
    private _runesService: RunesService
  ) { 

  }

}
