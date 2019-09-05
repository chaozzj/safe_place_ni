import { Component } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import L from "leaflet"; // Importamos L de leaflet para renderizar el mapa.
import { Observable } from 'rxjs';
//declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  map: L.Map;
  center: L.PointTuple;
  tempIcon: any;
  json_data:Array<object> = [];
  current_geo :any;
  constructor(private geolocation: Geolocation, public http: HttpClient) {
    console.log('geting places...');
    this.getPlaces();
  }

  ngOnInit(){
  }

  initMap(){
    console.log('current position')
    this.geolocation.getCurrentPosition().then(response => {
      console.log('response map...');
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  loadMap(position: Geoposition){
    console.log('loading map...');
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    /*console.log(latitude, longitude);*/
    let myLatLng = {lat: latitude, lng: longitude};
    this.current_geo = myLatLng;
    //--Start Leaflet code
    this.map = L.map('map', {
      center: this.current_geo,
      zoom: 16,

      });
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map);
    
      var marker = L.marker(this.current_geo).addTo(this.map);
      var popup = marker.bindPopup('<h1>Mi Ubicación</h1>');
      this.loadMarkers();
  }

  getPlaces(){
    console.log('requesting places');
    let jsondata :Observable<any>;
    console.log('requesting places');
    jsondata = this.http.get('http://spni.epicalesoft.com/places_json');
    jsondata.subscribe((json :any[]) => {
            console.log(json);
            //this.json_data = json;

            for (var i = 0, length = json.length; i < length; i++) {
              var data = json[i];//,

              this.json_data.push([data.name,data.address, data.lat, data.lon]);
            } 

            console.log(this.json_data);
        }); 
    console.log('init map...');
    this.initMap();

  }

  loadMarkers(){
    console.log('adding places...');
    var icon = L.icon({
      iconUrl: 'https://epicalesoft.com/safe_place_ni_place_icon.png',
      iconSize: [40, 50], // size of the icon
    });

    for (var i = 0; i < this.json_data.length; i++) {
			var marker = new L.marker([this.json_data[i][2],this.json_data[i][3]],{icon:icon})
				.bindPopup('<h1>'+this.json_data[i][0]+'</h1><br> <h4><strong>Dirección:</strong> '+this.json_data[i][1]+'</h4><button ion-item class=\"button-action\"  (click)=\"routePlace('+[this.json_data[i][2],this.json_data[i][3]]+')\" onclick=\"routePlace('+[this.json_data[i][2],this.json_data[i][3]]+');\">Indicaciones</button>')
				.addTo(this.map);
    }
    console.log('added places...');

  }


  routePlace(lat, lon){
    console.log(lat + lon);
    L.Routing.control({
      waypoints: [
        L.latLng(this.current_geo),
        L.latLng([lat, lon])
      ]
    }).addTo(this.map);
  }
}
