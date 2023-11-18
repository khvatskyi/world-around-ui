import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MapperHelper } from 'src/app/helpers/mapper.helper';
import { GetEventsOptions } from 'src/app/models/gateways/get-events-options';
import { CardModel } from 'src/app/models/cards/card';
import { GetEventsPageModel } from 'src/app/models/events/get-events-page';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-get-events',
  templateUrl: './get-events.component.html',
  styleUrls: ['./get-events.component.scss']
})
export class GetEventsComponent implements OnInit {

  isOwner: boolean = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  model: GetEventsPageModel = new GetEventsPageModel();
  cardModels: CardModel[] = [];

  constructor(
    private readonly mapper: MapperHelper,
    private readonly router: Router,
    private readonly authService: AuthorizationService,
    private readonly eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.getEvents(0, 5, this.isOwner);
  }

  onCheckBoxClick() {
    this.getEvents(0, 5, this.isOwner);
  }

  onPaginationOptionsChange(event: PageEvent) {
    this.getEvents(event.pageIndex, event.pageSize, this.isOwner);
  }

  getEvents(pageIndex: number, pageSize: number, isOwner): void {

    let options: GetEventsOptions = new GetEventsOptions({
      userId: this.authService.getUserId(),
      isOwner: isOwner,
      pageIndex: pageIndex,
      pageSize: pageSize,
    });

    this.eventsService.getEvents(options)
      .subscribe(result => {
        this.model = result;
        this.cardModels = [];
        this.model.events.forEach(event => {
          this.cardModels.push(this.mapper.mapGetEventToCard(event));
        });
      });
  }

  onCardClick(id: number) {
    this.router.navigate([`events/details/${id}`]);
  }
}
