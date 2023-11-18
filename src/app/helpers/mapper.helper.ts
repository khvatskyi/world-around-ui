import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { AttractionModel } from "../models/attractions/attractionModel";
import { CardModel } from "../models/cards/card";
import { GetEventModel } from "../models/events/get-event";
import { TripModel } from "../models/trips/tripModel";

@Injectable({
  providedIn: 'root'
})
export class MapperHelper {

  constructor(private readonly datepipe: DatePipe) { }

  map (source: object, destination: object) {

    Object.keys(destination).forEach(key => {
      destination[key] = source[key] ?? null;
    });

    return destination;
  }

  mapGetEventToCard(event: GetEventModel): CardModel {

    let card = <CardModel>this.map(event, new CardModel());
    card.subtitle = 'Starts: ' + this.datepipe.transform(event.startDate, 'dd/MM/yyyy');
    card.avatarPath = event.author?.imagePath;
    card.avatarTitle = event.author?.userName;

    return card;
  }

  mapAttractionToCard(attraction: AttractionModel): CardModel {

    let card = <CardModel>this.map(attraction, new CardModel());
    card.title = attraction.name;
    card.subtitle = 'by ' + attraction.authorName;
    return card;
  }

  mapTripToCard(trip: TripModel): CardModel {

    let card = <CardModel>this.map(trip, new CardModel());
    card.title = trip.name;
    card.subtitle = 'Created: ' + this.datepipe.transform(trip.createDate, 'dd/MM/yyyy');
    return card;
  }
}
