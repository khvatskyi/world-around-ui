import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTripModel } from 'src/app/models/trips/createTrip';
import { GetTripsModel } from 'src/app/models/trips/getTripsModel';
import { UpdateTripModel } from 'src/app/models/trips/updateTrip';
import { TripModel } from '../models/trips/tripModel';

@Injectable({
  providedIn: 'root'
})
export class TripsGateway {

  private baseUrl = `${environment.apiBaseUrl}Trips`;

  constructor(private http: HttpClient) { }

  getTrip(tripId: number): Observable<TripModel> {
    return this.http.get<TripModel>(`${this.baseUrl}/${tripId}`);
  }

  getTrips(params: any): Observable<GetTripsModel> {
    return this.http.get<GetTripsModel>(this.baseUrl, {params: params});
  }

  createTrip(createTripModel: CreateTripModel): Observable<any> {
    return this.http.post(this.baseUrl, createTripModel);
  }

  updateTripName(updateTripModel: UpdateTripModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/Name`, updateTripModel);
  }

  updateTripDescription(updateTripModel: UpdateTripModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/Description`, updateTripModel);
  }

  deleteTrip(tripId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tripId}`);
  }
}
