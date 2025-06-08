import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../../model/annonce';
import { TrainingDay } from '../../../model/TrainingDay';
import { UserService } from '../../../shared-service/userService/user.service';
import { AnnonceService } from '../../../shared-service/AnnonceService/annonce.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared-service/toastService/toast.service';

declare var $: any;

@Component({
  selector: 'app-ajouter-annonce',
  templateUrl: './ajouter-annonce.component.html',
  styleUrls: ['./ajouter-annonce.component.css'],
})
export class AjouterAnnonceComponent implements OnInit {
  annonce: Annonce = new Annonce();
  trainingDays: TrainingDay[] = [];
  selectedFile: File | null = null;
  user: any;

  constructor(
    private userService: UserService,
    private annonceService: AnnonceService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.user =
      this.userService.getUser() ||
      JSON.parse(localStorage.getItem('user') || '{}');
    this.addTrainingDay(); // Add one training day by default

    $(() => {
      $('.dropify').dropify({
        tpl: {
          wrap: '<div class="dropify-wrapper"></div>',
          loader: '<div class="dropify-loader"></div>',
          message:
            '<div class="dropify-message"><span class="file-icon" /> <p>Ajouter des photos pour votre salle de sport</p></div>',
          preview:
            '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">Ajouter une autre photo</p></div></div></div>',
          filename:
            '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
          clearButton:
            '<button type="button" class="dropify-clear">Supprimer</button>',
          errorLine:
            '<p class="dropify-error">Ooops, quelque chose qui cloche.</p>',
          errorsContainer:
            '<div class="dropify-errors-container"><ul></ul></div>',
        },
      });
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addTrainingDay(): void {
    this.trainingDays.push(new TrainingDay());
  }

  removeTrainingDay(index: number): void {
    this.trainingDays.splice(index, 1);
  }

  createAnnonce(): void {
    if (!this.selectedFile) {
      this.toastService.errorToast('Veuillez sélectionner une image', 'Erreur');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('titre', String(this.annonce.titre));
    formData.append('discipline', String(this.annonce.discipline));
    formData.append('prix', String(this.annonce.prix));
    formData.append('ville', String(this.annonce.ville));
    formData.append('rue', String(this.annonce.rue));
    formData.append('codePostal', String(this.annonce.codePostal));
    formData.append('capacite', String(this.annonce.capacite));
    formData.append('type', String(this.annonce.type));
    formData.append('dateDebut', String(this.annonce.dateDebut));
    formData.append('dateFin', String(this.annonce.dateFin));
    formData.append('description', String(this.annonce.description));
    formData.append('trainingday', JSON.stringify(this.trainingDays));

    this.annonceService.createAnnonce(formData).subscribe({
      next: (result) => {
        this.toastService.successToast('Annonce créée avec succès', 'Succès');
        this.router.navigate(['/mes-annonces']);
      },
      error: (error) => {
        console.error(error);
        this.toastService.errorToast(
          "Erreur lors de la création de l'annonce",
          'Erreur'
        );
      },
    });
  }
}
