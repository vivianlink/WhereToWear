import { Component } from '@angular/core';
import { ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {  } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { PhotosService } from './photos.service';
import {Photo} from "./photo";
import {MatDatepickerInputEvent} from "@angular/material";
import {WeatherService} from "./weather.service";
import {Weather} from "./weather";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private photosService: PhotosService,
    private weatherService: WeatherService
  ) {}

  private photos: Photo[];

  public searchControl: FormControl;

  private lat = 49;
  private lng = 123;
  private date: Date = new Date();

  private photosAreLoading = false;

  private weather: Weather;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit() {
    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['(cities)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          this.getPhotos();
        });
      });
    });
  }

  dateChanged(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
    this.getWeather();
  }

  getPhotos() {
    this.photosAreLoading = true;

    this.photosService.getPhotos(this.lng, this.lat).subscribe((data: Photo[]) => {
      this.photos = data;
      this.photosAreLoading = false;
    });
  }

  getWeather() {
    this.weatherService.getWeather(this.lng, this.lat, this.date).subscribe((data: Weather) => {
      this.weather = data;
      console.log(this.weather);
    });
  }
}
