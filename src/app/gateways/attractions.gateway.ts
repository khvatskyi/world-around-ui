import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateAttractionModel } from '../models/attractions/createAttractionModel';
import { GetAttractionModel } from '../models/attractions/getAttractionModel';
import { GetAttractionsModel } from '../models/attractions/getAttractionsModel';

@Injectable({
  providedIn: 'root'
})
export class AttractionsGateway {

  private baseUrl = `${environment.apiBaseUrl}Attractions`;

  constructor(private http: HttpClient) { }

  getAttractions(params: any): Observable<GetAttractionsModel> {
    return this.http.get<GetAttractionsModel>(this.baseUrl, {params: params});
  }

  getAttraction(attractionId: number):Observable<GetAttractionModel> {
    return this.http.get<GetAttractionModel>(`${this.baseUrl}/${attractionId}`);
  }

  createAttraction(createAttractionModel: FormData):Observable<any> {
    return this.http.post<CreateAttractionModel>(this.baseUrl, createAttractionModel);
  }
}
