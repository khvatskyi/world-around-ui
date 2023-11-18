import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttractionsGateway } from 'src/app/gateways/attractions.gateway';
import { CreateAttractionModel } from 'src/app/models/attractions/createAttractionModel';
import { PointModel } from 'src/app/models/map/point';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-create-attraction',
  templateUrl: './create-attraction.component.html',
  styleUrls: ['./create-attraction.component.scss']
})
export class CreateAttractionComponent implements OnInit {

  imageUrl: string | ArrayBuffer;
  model: CreateAttractionModel = {
    authorId: this.authService.getUserId()
  };

  constructor(
    private readonly attractionsGateway: AttractionsGateway,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly authService: AuthorizationService
  ) { }

  ngOnInit(): void {
  }

  onImageSelected(event: any) {

    if (!event.target.files[0] || event.target.files.length === 0) {
      return;
    }

    let image = <File>event.target.files[0];

    if (image.type.match(/image\/*/) === null) {
      return;
    }

    this.model.image = image;

    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  updateCurrentPinCoords(point: PointModel) {
    this.model.latitude = point.x;
    this.model.longitude = point.y;
  }

  saveAttraction(): void {
    console.log(this.model);

    if (!this.validateAttraction()) {
      return;
    }

    const formData = new FormData();
    for(let key in this.model){
      formData.append(key, this.model[key]);
    }

    this.attractionsGateway.createAttraction(formData).subscribe(() => {
      this.toastr.success('You have successfuly created new Attraction!', 'Success')
      this.router.navigate(['/my-attractions']);
    });
  }

  private validateAttraction(): boolean {
    if (!this.model.name) {
      this.toastr.error('Attraction name should not be empty.', 'Validation error');
      return false;
    }

    if (!this.model.description) {
      this.toastr.error('Attraction description should not be empty.', 'Validation error');
      return false;
    }

    if (!this.model.image) {
      this.toastr.error('Please choose location image.', 'Validation error');
      return false;
    }

    if (!this.model.latitude || !this.model.longitude) {
      this.toastr.error('Please choose location on map.', 'Validation error');
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/my-attractions']);
    this.toastr.info('You have canceled Attraction Creation.', 'Canceled')
  }
}
