import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard';
import { AttractionDetailsComponent } from './components/attractions/attraction-details/attraction-details.component';
import { AttractionsComponent } from './components/attractions/attractions.component';
import { CreateAttractionComponent } from './components/attractions/create-attraction/create-attraction.component';
import { MyAttractionsComponent } from './components/attractions/my-attractions/my-attractions.component';
import { CreateEventComponent } from './components/events/create-event/create-event.component';
import { EventDetailsComponent } from './components/events/event-details/event-details.component';
import { GetEventsComponent } from './components/events/get-events/get-events.component';
import { HomeComponent } from './components/home/home.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { SearchComponent } from './components/search/search.component';
import { CreateTripComponent } from './components/trips/create-trip/create-trip.component';
import { TripDetailComponent } from './components/trips/trip-detail/trip-detail.component';
import { TripsComponent } from './components/trips/trips.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'trips', component: TripsComponent, title: 'Trips' },
  { path: 'trips/create', canActivate: [AuthGuard], component: CreateTripComponent, title: 'Create Trip' },
  { path: 'attractions', component: AttractionsComponent, title: 'Attractions' },
  { path: 'attractions/:id', canActivate: [AuthGuard], component: AttractionDetailsComponent, title: 'Attraction Details' },
  { path: 'attractions-create', canActivate: [AuthGuard], component: CreateAttractionComponent, title: 'Create Attraction' },
  { path: 'my-attractions', canActivate: [AuthGuard], component: MyAttractionsComponent, title: 'My Attractions' },
  { path: 'my-profile', canActivate: [AuthGuard], component: MyProfileComponent, title: 'My Profile' },
  { path: 'trip/:id', canActivate: [AuthGuard], component: TripDetailComponent, title: 'Trip Details' },
  { path: 'search/:type/:value', component: SearchComponent, title: 'Search' },
  { path: 'events/create', component: CreateEventComponent, title: 'Create Event' },
  { path: 'events/details/:id', canActivate: [AuthGuard], component: EventDetailsComponent, title: 'Event Details' },
  { path: 'settings', canActivate: [AuthGuard], component: UserSettingsComponent, title: 'User Settings' },
  { path: 'events/my', canActivate: [AuthGuard], component: GetEventsComponent, title: 'My Events' },
  { path: '**', redirectTo: 'home', title: 'Home' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
