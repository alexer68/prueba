import { Component, OnInit } from '@angular/core';
import { IParameters } from '../../services/data.model';
import { IUsr } from '../../interfaces/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-prueba01',
  templateUrl: './prueba01.page.html',
  styleUrls: ['./prueba01.page.scss'],
})
export class Prueba01Page implements OnInit {

  constructor(private dataService: DataService) { }

  private sParam: IParameters = new IParameters();
  relusers: IUsr[] = [];


  ngOnInit() {
    this.LoadBD();
  }

  LoadBD(){
    this.sParam.op = 200;
    this.sParam.idorg = 1099;
    this.dataService.getDataLoad(this.sParam).subscribe(  res => {
      console.log(res);
      this.relusers = res.Result[0].usr;
    });
  }

}
