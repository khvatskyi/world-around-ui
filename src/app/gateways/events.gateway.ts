import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UriUtility } from '../utilities/uri.utility';
import { CreateEventModel } from '../models/events/create-event';
import { EventDetailsModel } from '../models/events/get-event-details';
import { GetEventsPageModel } from '../models/events/get-events-page';
import { UpdateEventModel } from '../models/events/update-event';
import { GetEventsOptions } from '../models/gateways/get-events-options';

@Injectable({
  providedIn: 'root'
})
export class EventsGateway {

  private basePath = UriUtility.createUri(environment.apiBaseUrl, 'Events');

  constructor(private readonly http: HttpClient) { }

  getById(id: number): Observable<EventDetailsModel> {

    return this.http.get<EventDetailsModel>(UriUtility.createUri(this.basePath, id.toString()));
  }

  getEvents(options: GetEventsOptions): Observable<GetEventsPageModel> {

    return this.http.get<GetEventsPageModel>(UriUtility.createUri(this.basePath), {
      params: {
        ...options
      }
    });
  }

  createEvent(data: FormData): Observable<EventDetailsModel> {
    return this.http.post<EventDetailsModel>(this.basePath, data);
  }

  update(model: UpdateEventModel): Observable<EventDetailsModel> {
    return this.http.post<EventDetailsModel>(UriUtility.createUri(this.basePath, model.id.toString()), model);
  }

  updateEventImage(eventId: number, image: FormData): Observable<any> {
    let path = UriUtility.createUri(this.basePath, 'UpdateEventImage', eventId.toString());

    return this.http.put(path, image);
  }

  delete(eventId: number) {
    return this.http.delete(UriUtility.createUri(this.basePath, eventId.toString()));
  }
}
