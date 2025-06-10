// gestion-ajout-produit.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { produit } from "../../../model/produit";
import { ToastService } from "../../../shared-service/toastService/toast.service";
import { ProduitserviceService } from "../../../shared-service/ProduitService/produitservice.service";
import { categorie } from "../../../model/categorie";
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-ajout-produit',
  templateUrl: './gestion-ajout-produit.component.html',
  styleUrls: ['./gestion-ajout-produit.component.css']
})
export class GestionAjoutProduitComponent implements OnInit {
  @ViewChild('nomproduitInput') nomproduitInput!: ElementRef;
  @ViewChild('prixInput') prixInput!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;
  @ViewChild('quantiteInput') quantiteInput!: ElementRef;
  @ViewChild('categorieIdInput') categorieIdInput!: ElementRef;

  produit: produit = new produit();
  categories: categorie[] = [];
  SelectedValue: any;
  selectedFiles?: FileList;
  previews: string[] = [];
  submitted = false;

  constructor(
    private toastService: ToastService,
    private produitservice: ProduitserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.produitservice.getAllCategorie().subscribe({
      next: (data) => {
        this.categories = data.categories || [
          {id: 1, nom: "Fitness"},
          {id: 2, nom: "Musculation"},
          {id: 3, nom: "Cross-fit"},
          {id: 4, nom: "Gymnastique"}
        ];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.toastService.errorToast("Erreur de chargement des catégories", "Erreur");
      }
    });
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    this.previews = [];

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.push(e.target.result);
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  removeImage(index: number): void {
    this.previews.splice(index, 1);
    // You might also want to remove from selectedFiles if you're tracking that
  }

  createProduit(): void {
    this.submitted = true;

    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.toastService.errorToast("Veuillez ajouter au moins une image", "Erreur");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('imagesProduits[]', this.selectedFiles[i]);
    }

    formData.append('nomproduit', this.nomproduitInput.nativeElement.value);
    formData.append('prix', this.prixInput.nativeElement.value);
    formData.append('description', this.descriptionInput.nativeElement.value);
    formData.append('quantite', this.quantiteInput.nativeElement.value);
    formData.append('categorieId', this.categorieIdInput.nativeElement.value);

    this.produitservice.createProduct(formData).subscribe({
      next: (response) => {
        this.showSuccess();
        this.router.navigate(['/liste-Produit']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.toastService.errorToast("Erreur lors de la création du produit", "Erreur");
      }
    });
  }

  showSuccess(): void {
    this.toastService.successToast('Produit ajouté avec succès!', 'Succès!');
  }
}
