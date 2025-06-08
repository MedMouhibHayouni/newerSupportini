import { Component, OnInit } from '@angular/core';
import { ToastService } from "../../../shared-service/toastService/toast.service";
import { SalleDeSportService } from "../../../shared-service/salleDeSportService/salle-de-sport.service";
import { sallesport } from "../../../model/salleDeSport";
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';

declare var $: any;

@Component({
  selector: 'app-modifier-salle',
  templateUrl: './modifier-salle.component.html',
  styleUrls: ['./modifier-salle.component.scss']
})
export class ModifierSalleComponent implements OnInit {
  gym!: sallesport;
  id!: string;
  selectedFile?: File;

  constructor(
    private toastService: ToastService,
    private salleDeSportService: SalleDeSportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // Initialize dropify with animations
    $(() => {
      $('.dropify').dropify({
        tpl: {
          wrap: '<div class="dropify-wrapper animate-pop-in"></div>',
          loader: '<div class="dropify-loader animate-pulse"></div>',
          message: '<div class="dropify-message"><span class="file-icon" /> <p>Ajouter des photos pour votre salle de sport</p></div>',
          preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">Ajouter une autre photo</p></div></div></div>',
          filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
          clearButton: '<button type="button" class="dropify-clear">Supprimer</button>',
          errorLine: '<p class="dropify-error">Ooops, quelque chose qui cloche.</p>',
          errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
        }
      });
    });

    this.salleDeSportService.getGymById(this.id).subscribe(
      (data) => {
        this.gym = data.gym;
        console.log(data);

        // GSAP animations after data load
        gsap.from('.bg-orange-500', {
          duration: 0.8,
          y: -50,
          opacity: 0,
          ease: 'power3.out'
        });

        gsap.from('form', {
          duration: 0.6,
          opacity: 0,
          y: 20,
          delay: 0.3,
          ease: 'back.out(1)'
        });
      }
    );
  }

  onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateGym(): void {
    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('imageVitrine', this.selectedFile, this.selectedFile.name);

      this.salleDeSportService.postImageGym(uploadData, this.id).subscribe();
    }

    this.salleDeSportService.putGymUpdate(this.id, this.gym).subscribe(
      (data) => {
        this.gym = data.updated;
        this.toastService.successToast("Modification avec succès", "success");

        // Success animation
        gsap.to('.bg-orange-500', {
          duration: 0.5,
          backgroundColor: '#10B981',
          onComplete: () => {
            setTimeout(() => {
              gsap.to('.bg-orange-500', {
                duration: 0.5,
                backgroundColor: '#F59E0B'
              });
            }, 1000);
          }
        });
      },
      (error) => {
        // Error animation
        gsap.to('.bg-orange-500', {
          duration: 0.5,
          backgroundColor: '#EF4444',
          yoyo: true,
          repeat: 1
        });
      }
    );
  }
}
