import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { EventsGateway } from "../gateways/events.gateway";
import { ImageUtility } from "../utilities/image.utility";
import { CreateEventModel } from "../models/events/create-event";
import { EventDetailsModel } from "../models/events/get-event-details";
import { GetEventsPageModel } from "../models/events/get-events-page";
import { GetEventsOptions } from "../models/gateways/get-events-options";
import { AuthorizationService } from "./authorization.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private readonly gateway: EventsGateway,
    private readonly authService: AuthorizationService) {
  }

  getEvents(options: GetEventsOptions): Observable<GetEventsPageModel> {

    return this.gateway.getEvents(options)
      .pipe(
        map(result => {
          result.events.forEach(event => {
            if (event.imagePath) {
              event.imagePath = ImageUtility.convertImagePathToUrl(event.imagePath);
            }

            if (event.author?.imagePath) {
              event.author.imagePath = ImageUtility.convertImagePathToUrl(event.author.imagePath);
            }
          });

          return result;
        })
      );
  }

  getById(id: number): Observable<EventDetailsModel> {

    return this.gateway.getById(id)
      .pipe(
        map(result => {

          if (result.image) {
            result.image = ImageUtility.convertImagePathToUrl(result.image);
          }

          result.createDate = new Date(Date.parse(result.createDate.toString()));
          result.startDate = new Date(Date.parse(result.startDate?.toString()));
          result.endDate = new Date(Date.parse(result.endDate?.toString()));

          return result;
        })
      );
  }

  createEvent(model: CreateEventModel): Observable<EventDetailsModel> {
    model.createUserId = this.authService.getUserId();
    let formData = new FormData();

    if (model.places.length == 0) {
      model.places = null;
    }

    for (let key in model) {
      if (model[key] && key != 'participants' && key != 'places') {
        formData.append(key, model[key]);
      }
    }

    for (let i = 0; i < model.participants.length; i++) {
      formData.append(`participants[${i}]`, model.participants[i].toString());
    }

    for (let i = 0; i < model.places.length; i++) {
      for(let key in model.places[i]) {
        formData.set(`places[${i}].${key}`, model.places[i][key])
      }
    }

    formData.set('startDate', model.startDate.toUTCString());

    if (model.endDate) {
      formData.set('endDate', model.endDate.toUTCString());
    }

    return this.gateway.createEvent(formData);
  }
}
