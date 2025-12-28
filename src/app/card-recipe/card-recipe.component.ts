import { Component, computed, input, Input } from '@angular/core';
import { RunesService } from '../services/runes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'd-card-recipe',
  templateUrl: './card-recipe.component.html',
  styleUrls: ['./card-recipe.component.scss'],
  imports: [CommonModule]
})
export class CardRecipeComponent {

  recipe = input<any>({});
  @Input() showStatus: boolean = false;
  listRunes = computed(() => {
    return this.recipe().runes?.map((item: any) => {
      return {
        ...item,
        img: this._runesService.buildNameImage(item.name)
      }
    }) || [];
  });

  arms = computed(() => {
    return this.recipe().arm?.join(', ') || '';
  });

  constructor(
    private _runesService: RunesService
  ) { 

  }

}
