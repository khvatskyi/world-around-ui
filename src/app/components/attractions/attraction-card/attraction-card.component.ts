import { Component, Input, OnInit } from '@angular/core';
import { AttractionModel } from 'src/app/models/attractions/attractionModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attraction-card',
  templateUrl: './attraction-card.component.html',
  styleUrls: ['./attraction-card.component.scss']
})
export class AttractionCardComponent implements OnInit {

  @Input()attraction: AttractionModel;
  
  backgroundImage:String;

  constructor() { }

  ngOnInit(): void {
    this.backgroundImage = `url("${environment.cloudStorageUrl + this.attraction.imagePath}")`;
  }
}
