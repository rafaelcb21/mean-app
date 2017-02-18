import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

declare var accounting: any;

@Pipe({
    name: 'numerobrasil'
})
export class NumberBrasil implements PipeTransform {
  transform(value: any, type: string): any {

    if(type == "money"){
      if(value != ""){
        var str = accounting.formatMoney(value, "R$ ", 2, ".", ",");
      }else{
        str = accounting.formatMoney("0", "R$ ", 2, ".", ",");
      }
      return str;
    }else if(type == "date"){
      if(value != ""){
        var data = moment(value).format("DD/MM/YYYY");
      }else{
        data = "";
      }
      return data;
    }else if(type == "captalize"){
      if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }
  }
}
