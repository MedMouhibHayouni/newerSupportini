import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipementGymService {
  private baseUrl = "http://localhost:8080/equipmentGym";

  constructor(private httpClient: HttpClient) { }

  createEquipment(gymId: number, formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create/${gymId}`, formData);
  }

  getEquipment(gymId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/affiche/${gymId}`);
  }

  updateEquipment(equipmentId: number, equipment: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/update/${equipmentId}`, equipment);
  }
}
