import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IEquipment } from '../models/equipment/equipment.model';
import { UriUtility } from '../utilities/uri.utility';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private baseUrl = UriUtility.createUri(environment.apiBaseUrl, 'Events');

  constructor(private readonly http: HttpClient) { }

  getEquipments(eventId: number): Observable<IEquipment[]> {
    const url = this.baseUrl + `/${eventId}/Equipments`;
 
    return this.http.get<IEquipment[]>(url);
  }

  addEquipment(eventId: number, name: string): Observable<number> {
    const url = this.baseUrl + `/${eventId}/Equipments`;
 
    return this.http.post<number>(url, {
      name
    });
  }

  deleteEquipment(eventId: number, equipmentId: number): Observable<IEquipment> {
    const url = this.baseUrl + `/${eventId}/Equipments/${equipmentId}`;

    return this.http.delete<IEquipment>(url);
  }
}
