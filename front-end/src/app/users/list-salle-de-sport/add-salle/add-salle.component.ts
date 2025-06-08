import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/user';
import { sallesport } from '../../../model/salleDeSport';
import { UserService } from '../../../shared-service/userService/user.service';
import { ToastService } from '../../../shared-service/toastService/toast.service';
import { SalleDeSportService } from '../../../shared-service/salleDeSportService/salle-de-sport.service';
import { gsap } from 'gsap';

declare var $: any;

@Component({
  selector: 'app-add-salle',
  templateUrl: './add-salle.component.html',
  styleUrls: ['./add-salle.component.scss'],
})
export class AddSalleComponent implements OnInit {
  @ViewChild('nomSalleInput') nomSalleInput!: ElementRef;
  @ViewChild('urlInput') urlInput!: ElementRef;
  @ViewChild('numTelinput') numTelinput!: ElementRef;
  @ViewChild('villeinput') villeinput!: ElementRef;
  @ViewChild('rueinput') rueinput!: ElementRef;
  @ViewChild('prixinput') prixinput!: ElementRef;
  @ViewChild('postalinput') postalinput!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;

  iduser!: Number;
  user!: User;
  selectedFiles?: FileList;
  value: any = 0;
  previews: string[] = [];
  listGym!: sallesport[];
  gym!: sallesport;
  montant!: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private salleDeSportService: SalleDeSportService
  ) {}

  ngOnInit(): void {
    this.user =
      this.userService.getUser() ||
      JSON.parse(localStorage.getItem('user') || '{}');
    this.iduser = this.user.id;
    this.gym = new sallesport();

    // Initialize dropify with animations
    $(() => {
      $('.dropify').dropify({
        tpl: {
          wrap: '<div class="dropify-wrapper animate-pop-in"></div>',
          loader: '<div class="dropify-loader animate-pulse"></div>',
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

    // GSAP animations
    gsap.from('.bg-orange-500', {
      duration: 0.8,
      y: -50,
      opacity: 0,
      ease: 'power3.out',
    });
  }

  formatLabel(value: number): string {
    return value + '%';
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  createGym(): void {
  if (!this.selectedFiles || this.selectedFiles.length === 0) {
    this.toastService.errorToast("Images Obligatoire", "Erreur");
    return;
  }

  const formData: FormData = new FormData();

  // Append text fields
  formData.append('nomSalle', this.nomSalleInput.nativeElement.value);
  formData.append('numTel', this.numTelinput.nativeElement.value);
  formData.append('ville', this.villeinput.nativeElement.value);
  formData.append('rue', this.rueinput.nativeElement.value);
  formData.append('codePostal', this.postalinput.nativeElement.value);
  formData.append('description', this.descriptionInput.nativeElement.value);
  formData.append('prix', this.prixinput.nativeElement.value);
  formData.append('url', this.urlInput.nativeElement.value);

  // Append files
  for (let i = 0; i < this.selectedFiles.length; i++) {
    formData.append('images[]', this.selectedFiles[i]);
  }

  this.salleDeSportService.createGym(formData).subscribe({
    next: (result) => {
      this.toastService.successToast(result.message, result.titre);
      //this.router.navigate(["list-salle-de-sport"]);
    },
    error: (err) => {
      this.toastService.errorToast(err.error?.message || 'Erreur', "Erreur");
    }
  });
}
}
