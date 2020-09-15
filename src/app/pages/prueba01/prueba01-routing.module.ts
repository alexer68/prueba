import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Prueba01Page } from './prueba01.page';

const routes: Routes = [
  {
    path: '',
    component: Prueba01Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Prueba01PageRoutingModule {}
