import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapMode } from 'src/app/models/map/map-mode';
import { PointModel } from 'src/app/models/map/point';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() width: string = '100%'
  @Input() height: string = '600px';
  @Input() mapId: string = 'mapId';
  @Input() mapMode: MapMode = MapMode.View;

  @Output() mapClick: EventEmitter<PointModel> = new EventEmitter<PointModel>();

  activeMarkerSeqNo: number;

  private map: any;
  private route: any;
  private activeMarker: any;
  private editedMarker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.off();
    this.map?.remove();
  }

  setWaypoints(points: PointModel[]): void {
    const waypoints = points.map(point => L.latLng(point.x, point.y))
    this.route.setWaypoints(waypoints);
  }

  saveActiveMarker(): void {
    if (!this.activeMarker) {
      return;
    }

    this.activeMarker = false;
  }

  enableClick(): void {
    this.map.on("click", e => this.onClick(e));
  }

  disableClick(): void {
    this.map.off("click", e => this.onClick(e));
  }

  confirmUpdating(): void {
    this.editedMarker = null;
    this.activeMarkerSeqNo = null;
  }

  cancelUpdating(): void {
    if(this.editedMarker) {
      this.route.spliceWaypoints(this.activeMarkerSeqNo, 1, this.editedMarker);
    }
    this.confirmUpdating();
  }

  private initMap(): void {

    this.map = L.map(this.mapId, {
      center: [48.2852, 25.9287],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (this.mapMode != MapMode.View) {
      this.map.on("click", e => this.onClick(e));
    }

    const planOptions = { addWaypoints: false, draggableWaypoints: false };
    const plan = L.Routing.plan([], planOptions);

    this.route = L.Routing.control({
      plan,
      lineOptions: {
        addWaypoints: false,
        missingRouteTolerance: 10,
        extendToWaypoints: false
      },
      waypoints: []
    }).addTo(this.map);
  }

  private onClick(event: any): void {

    const point = new PointModel(event.latlng.lat, event.latlng.lng);

    if(this.mapMode == MapMode.Add){
      this.addPoint(point);
    }
    if(this.mapMode == MapMode.Update){
      this.updatePoint(point);
    }

    if (!this.activeMarker) {
      this.activeMarker = true;
    }

    this.mapClick.emit(point);
  }

  private addPoint(point: PointModel) {

    const waypoints = this.route.getWaypoints();
    const markersLength = waypoints.length;

    const firstEmpty = waypoints.findIndex(x => !x.latLng);

    const removeCount = this.activeMarker || firstEmpty != -1 || this.activeMarker && markersLength == 2 ? 1 : 0;
    const removeIndex = this.getWaypointRemoveIndex(firstEmpty, this.activeMarker, markersLength);

    this.route.spliceWaypoints(removeIndex, removeCount, L.latLng(point.x, point.y));
  }

  private getWaypointRemoveIndex(firstEmpty: number, isActive: boolean, markersLength: number): number {
    if (firstEmpty > -1 && !this.activeMarker) {
      return firstEmpty;
    }

    if (firstEmpty == 1 && this.activeMarker) {
      return 0;
    }

    if (firstEmpty == -1 && !this.activeMarker) {
      return markersLength;
    }

    if (firstEmpty == -1 && this.activeMarker) {
      return markersLength == 2
        ? 1
        : markersLength - 1;
    }

    return markersLength;
  }

  private updatePoint(point: PointModel) {

    if(this.activeMarkerSeqNo != null) {

      if(!this.editedMarker) {
        const waypoints = this.route.getWaypoints();
        this.editedMarker = waypoints[this.activeMarkerSeqNo];
      }

      this.route.spliceWaypoints(this.activeMarkerSeqNo, 1, L.latLng(point.x, point.y));
    }
  }
}
