import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroPage } from './registro.page';

const newLocal = 'familiar';
const routes: Routes = [
  {
    path: '',
    redirectTo: newLocal
  },
  {
    path: '',
    component: RegistroPage,
    children: [
      {
        path: 'familiar',
        loadChildren: () => import('./familiar/familiar.module').then( m => m.FamiliarPageModule)
      },
      {
        path: 'estudiante',
        loadChildren: () => import('./estudiante/estudiante.module').then( m => m.EstudiantePageModule)
      },
      {
        path: 'alex',
        loadChildren: () => import('../prueba01/prueba01.module').then( m => m.Prueba01PageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPageRoutingModule {}
