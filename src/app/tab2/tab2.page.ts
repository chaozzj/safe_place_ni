import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})



export class Tab2Page {
  public json_data:any;
  constructor(public http: HttpClient) {
    console.log('init places...');
    this.getPlaces();
  }
 
  ngOnInit(){
   
  }

  ionViewDidLoad(){
   
  }
  ngAfterViewInit(){
    
  }
  getPlaces(){
    let jsondata :Observable<any>;
    console.log('requesting places');
    jsondata = this.http.get('http://spni.epicalesoft.com/places_json');
    jsondata.subscribe((json :any[]) => {
            console.log(json);
            this.json_data = json;
        });
  }
}
