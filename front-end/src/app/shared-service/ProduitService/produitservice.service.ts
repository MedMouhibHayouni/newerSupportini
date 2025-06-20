import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {produit} from "../../model/produit";
import {categorie} from "../../model/categorie";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProduitserviceService {

  public search = new BehaviorSubject<string>("");



  constructor(private httpClient: HttpClient) {
  }
  getcatid : string="http://localhost:8080/categorie/afficheId"
getCategorie :string="http://localhost:8080/categorie/affiche"
  getAllprodUrl: string = "http://localhost:8080/produit/affiche"
     getProdParIdUrl : string ="http://localhost:8080/produit/afficheById"
  getprodWithLettreUrl: string = "http://localhost:8080/produit/search?nomproduit="
  postprodCreatUrl: string = "http://localhost:8080/produit/create"
  deleteprodUrl :string="http://localhost:8080/produit/delete"
  updateproUrl :string ="http://localhost:8080/produit/update"
  getProdSoetedAscUrl  : string = "http://localhost:8080/produit/get-sorted-asc-price"
  getProdSoetedDescUrl : string = "http://localhost:8080/produit/get-sorted-desc-price"
  getImagesProduitsUrl :string ="http://localhost:8080/produit/afficheImages"

  private apiUrl = 'http://localhost:8080'; // Update with your API URL




  getAllProduct() {
    return this.httpClient.get<any>(this.getAllprodUrl)
  }


  getOneProduct(id:any){
    return this.httpClient.get<any>(this.getProdParIdUrl+"/"+id)
  }


  createProduct(p: any) {
    return this.httpClient.post(this.postprodCreatUrl, p)
  }

  getAll(id:any){
    return this.httpClient.get<any>(this.getcatid+"/"+id);

}
  getallcategorie(){
return this.httpClient.get<any>( this.getCategorie)
  }
 deleteProduct(id:any){
    return this.httpClient.delete<any>(this.deleteprodUrl+"/" +id)
 }
 update(id: any,produit:produit ){
    return this.httpClient.put<any>(this.updateproUrl+"/" +id,produit)
 }
  getSortedProdWithPriceDesc(){
    return this.httpClient.get<any>( this.getProdSoetedDescUrl)
  }
  getProdSoetedAsc(){
    return this.httpClient.get<any>(this.getProdSoetedAscUrl)
  }
  filterProduitByName(name:any){
    return this.httpClient.get<any>(this.getprodWithLettreUrl+name)
  }
  getImagesProduits(id : any){
    return this.httpClient.get<any>(this.getImagesProduitsUrl+"/"+id)
  }


  // Category methods
  createCategorie(categorie: categorie): Observable<categorie> {
    return this.httpClient.post<categorie>(`${this.apiUrl}/categorie/create`, categorie);
  }

  getAllCategorie(): Observable<{categories: categorie[]}> {
    return this.httpClient.get<{categories: categorie[]}>(`${this.apiUrl}/categorie/affiche`);
  }

  getCategorieById(id: number): Observable<categorie> {
    return this.httpClient.get<categorie>(`${this.apiUrl}/categorie/afficheById/${id}`);
  }

  updateCategorie(id: number, categorie: categorie): Observable<categorie> {
    return this.httpClient.put<categorie>(`${this.apiUrl}/categorie/update/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/categorie/${id}`);
  }
}
