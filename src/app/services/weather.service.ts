import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemperatureData } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://172.24.188.176:5000/api/'; // URL de tu API
  
  constructor(private http: HttpClient) {}

  getTemperatureData(): Observable<any> {  //la funcion para la temperatura
    return this.http.get(this.apiUrl + 'temperatura');

  }

  gethumedad_relativa(): Observable<any> { //funcion para humedad rel
    return this.http.get(this.apiUrl + 'humedad_relativa');

  }

  
  gethumedad_absoluta(): Observable<any> {
    return this.http.get(this.apiUrl + 'humedad_absoluta');

  }


  getvelocidad_viento(): Observable<any> {
    return this.http.get(this.apiUrl + 'velocidad_viento');

  }

  getpresion_barometrica(): Observable<any> { 
    return this.http.get(this.apiUrl + 'presion_barometrica');

  }




}
