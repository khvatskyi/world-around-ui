import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserModel } from 'src/app/models/users/user';

@Component({
  selector: 'app-event-room',
  templateUrl: './event-room.component.html',
  styleUrls: ['./event-room.component.scss']
})
export class EventRoomComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  users: UserModel[];
  eventId: number;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.eventId = Number(params.get('id'));
      });

    this.users = [
      {
        id: 1,
        userName: 'admin',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: '',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'khvatskyi',
        email: 'admin@gmail.com',
        firstName: 'Oleksandr',
        lastName: 'Slobodian',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'cami',
        email: 'admin@gmail.com',
        firstName: 'Cami',
        lastName: 'Strilling',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'roman',
        email: 'admin@gmail.com',
        firstName: 'Roman',
        lastName: 'Nazarenko',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'oksana',
        email: 'admin@gmail.com',
        firstName: 'Oksana',
        lastName: 'Petrushyn',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'ivo',
        email: 'admin@gmail.com',
        firstName: 'Ivan',
        lastName: 'Ivanchenko',
        imagePath: 'assets/images/userPlaceholder.png'
      },
      {
        id: 1,
        userName: 'carendoh',
        email: 'admin@gmail.com',
        firstName: 'Lance',
        lastName: 'Lim',
        imagePath: 'assets/images/userPlaceholder.png'
      }
    ];
  }

}
