import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location as LocationModel } from '../models/waste-report.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() { }

  getCurrentLocation(): Observable<LocationModel> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationModel = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location',
            barangay: 'Malabanias',
            city: 'Angeles City'
          };
          observer.next(location);
          observer.complete();
        },
        (error) => {
          observer.error(error.message);
        }
      );
    });
  }

  getAddressFromCoordinates(lat: number, lng: number): Observable<string> {
    // Mock implementation - in real app, use geocoding API
    const mockAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}, Malabanias, Angeles City`;
    return of(mockAddress);
  }

  validateLocation(location: LocationModel): boolean {
    return !!(
      location.latitude >= -90 && location.latitude <= 90 &&
      location.longitude >= -180 && location.longitude <= 180 &&
      location.barangay && location.city
    );
  }
}
