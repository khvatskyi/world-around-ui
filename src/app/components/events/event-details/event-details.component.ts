import { Component, OnInit } from '@angular/core';
import { EventDetailsModel } from 'src/app/models/events/get-event-details';
import { ActivatedRoute, Router, } from '@angular/router';
import { ParticipantRole } from 'src/app/enums/participant-role';
import { ParticipantModel } from 'src/app/models/users/participant';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ChipItem } from 'src/app/models/events/chip-item';
import { ItemType } from 'src/app/enums/item-type';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  private id: number;

  pending: boolean = true;
  userIsParticipant: boolean = false;
  fullName: string;
  owner: ParticipantModel;
  model: EventDetailsModel;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly eventsService: EventsService,
    private readonly authService: AuthorizationService) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.eventsService.getById(this.id)
      .subscribe(result => {
        this.model = result;

        for (let i = 0; i < this.model.participants.length; i++) {
          if (this.model.participants[i].participantRoleId === ParticipantRole.Owner) {
            this.owner = this.model.participants[i];
          }
        }

        let userName = this.authService.getUserName();

        for (let i = 0; i < this.model.participants.length; i++) {
          if (userName == this.model.participants[i].userName) {
            this.userIsParticipant = true;
            break;
          }
        }

        if (this.owner) {
          this.setAuthor();
        }

        if (this.model.endDate <= this.model.startDate) {
          this.model.endDate = null;
        }

        this.pending = false;
      });
  }

  onGoToChat(): void {
    // this.router.navigate(['events/', { id: 7 }]);
  }

  onPlaceClick(place: ChipItem) {

    let link = 'trip/' + place.id;

    if (place.placeType === ItemType.attraction) {
      link = 'attractions/' + place.id;
    }

    this.router.navigate([])
      .then(() => { window.open(link), '_blank' });
  }

  private setAuthor(): void {

    if (!this.owner.firstName || !this.owner.lastName) {
      this.model.author = this.owner.userName;

      return;
    }

    this.model.author = this.owner.firstName + ' ' + this.owner.lastName;
  }
}
