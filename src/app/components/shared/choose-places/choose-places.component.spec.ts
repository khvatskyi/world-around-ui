import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlacesComponent } from './choose-places.component';

describe('ChoosePlacesComponent', () => {
  let component: ChoosePlacesComponent;
  let fixture: ComponentFixture<ChoosePlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosePlacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
