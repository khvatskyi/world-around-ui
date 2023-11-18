import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdatePinModel } from 'src/app/models/pins/updatePin';

@Injectable({
  providedIn: 'root'
})
export class PinsGateway {

  private baseUrl = `${environment.apiBaseUrl}Pins`;

  constructor(private http: HttpClient) { }

  updatePin(updatePinModel: UpdatePinModel): Observable<any> {
    return this.http.put(this.baseUrl, updatePinModel);
  }
}
