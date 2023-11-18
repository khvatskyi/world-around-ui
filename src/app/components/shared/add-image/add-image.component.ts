import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent {

  @Input() imageUrl: string | ArrayBuffer;
  @Output() selectedImage = new EventEmitter<any>();

  constructor() { }

  onImageSelected($event: any): void {
    this.selectedImage.emit($event);
  }
}
