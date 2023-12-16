import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRoomComponent } from './event-room.component';

describe('EventRoomComponent', () => {
  let component: EventRoomComponent;
  let fixture: ComponentFixture<EventRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventRoomComponent]
    });
    fixture = TestBed.createComponent(EventRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
