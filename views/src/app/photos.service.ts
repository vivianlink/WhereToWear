import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Photo} from './photo';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  constructor(private http: HttpClient) {}

  getPhotos(lng: number, lat: number) {
    return this.http.get<Photo[]>(`/api/getPhotos?lng=${lng}&lat=${lat}`);
  }
}
