import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { MeasureViewPipe } from '@pipes/measure-view.pipe'
import { MeasureIconPipe } from '@pipes/measure-icon.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MeasureViewPipe,
    MeasureIconPipe
  ],
  exports: [
    MeasureViewPipe,
    MeasureIconPipe
  ]
})
export class PipesModule { }
