import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyData } from './my.data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url: string = 'https://prog2005.it.scu.edu.au/ArtGalley/';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<MyData[]> {
    return this.http.get<MyData[]>(this.url);
  }

  getData(name: string): Observable<MyData[]> {
    return this.http.get<MyData[]>(this.url + name);
  }

  addData(record: MyData): Observable<MyData> {
    return this.http.post<MyData>(this.url, record);
  }
  
}
