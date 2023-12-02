import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tripsLength: number = 0;
  attractionsLength: number = 0;

  users: any = [];
  events: any = [];

  type: string;
  value: string;

  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.type = params['type'];
      this.value = params['value'];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setTripsLength(tripsLength: any): void {
    this.tripsLength = tripsLength;
  }

  setAttractionsLength(attractionsLength: any): void {
    this.attractionsLength = attractionsLength;
  }

  getTitle(): string {
    let result = 'Found ';

    if (this.type == '0') {
      result += this.tripsLength;
      result += ' Trip';
      if (this.tripsLength !== 1) {
        result += 's';
      }
    }

    if (this.type == '1') {
      result += this.attractionsLength;
      result += ' Attraction';
      if (this.attractionsLength !== 1) {
        result += 's';
      }
    }

    if (this.type == '2') {
      result += this.events.length;
      result += ' Event';
      if (this.events.length !== 1) {
        result += 's';
      }
    }

    if (this.type == '3') {
      result += this.users.length;
      result += ' User';
      if (this.users.length !== 1) {
        result += 's';
      }
    }
    return result;
  }
}