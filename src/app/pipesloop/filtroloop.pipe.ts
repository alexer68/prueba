import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroloop'
})
export class FiltroloopPipe implements PipeTransform {

  transform( arreglo: any[],
             texto: number,
             columna: string ): any[] {
    if ( texto === 0) {
      return arreglo;
    }
    return arreglo.filter( item => {
      return item[columna] === texto;
    });
}
}

