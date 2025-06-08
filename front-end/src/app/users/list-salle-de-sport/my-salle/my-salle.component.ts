import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { sallesport } from "../../../model/salleDeSport";
import { SalleDeSportService } from "../../../shared-service/salleDeSportService/salle-de-sport.service";
import { ToastService } from "../../../shared-service/toastService/toast.service";
import { Router } from "@angular/router";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-my-salle',
  templateUrl: './my-salle.component.html',
  styleUrls: ['./my-salle.component.scss']
})
export class MySalleComponent implements OnInit {
    @ViewChild('gymCardsContainer') gymCardsContainer!: ElementRef;

  id!: any;
  searchGym!: string;
  listeGym!: sallesport[];
    private animationTimeline!: gsap.core.Timeline;


  constructor(
    private salleDeSportService: SalleDeSportService,
    private toastService: ToastService,
    private router: Router
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Update your ngOnInit
ngOnInit(): void {
  this.salleDeSportService.getMyGym().subscribe(
    (data) => {
      console.log('API Response:', data); // Debug log


      // Handle different response structures
      if (Array.isArray(data)) {
        this.listeGym = data;
      } else if (data?.mygym) {
        this.listeGym = data.mygym;
      } else if (data?.data) {
        this.listeGym = data.data;
      } else {
        this.listeGym = [];
      }
            setTimeout(() => this.initAnimations(), 0);


      console.log('Processed list:', this.listeGym); // Debug log
    },
    (error) => {
      console.error('Error fetching gyms:', error);
      this.listeGym = [];
    }
  );
}
ngAfterViewInit(): void {
    this.initScrollTriggers();
  }

   ngOnDestroy(): void {
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

    initScrollTriggers(): void {
    ScrollTrigger.refresh();
  }

   initAnimations(): void {
    // Clear any existing ScrollTriggers to avoid duplicates
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Animate empty state
    gsap.from('.animate-fade-in', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "power2.out"
    });

    // Animate gym cards
    const cards = gsap.utils.toArray('.gym-card');
    if (cards.length > 0) {
      gsap.from(cards, {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: this.gymCardsContainer.nativeElement,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }
  }


  animateListUpdate(): void {
    const cards = gsap.utils.toArray('.gym-card');
    gsap.from(cards, {
      duration: 0.5,
      x: -20,
      opacity: 0,
      stagger: 0.05,
      ease: "power2.out"
    });
  }




async deleteGym(id: any) {
  const confirmed = await this.toastService.showConfirmDialog(
    'Confirmer la suppression',
    'Êtes-vous sûr de vouloir supprimer cette salle de sport ? Cette action est irréversible.',
    'Supprimer',
    'Annuler',
    'error'
  );

  if (confirmed) {
    this.salleDeSportService.deleteSalle(id).subscribe({
      next: (result) => {
        this.toastService.successToast(result.message, 'Succès');
        // Animate removal
        const card = document.querySelector(`[data-gym-id="${id}"]`);
        if (card) {
          gsap.to(card, {
            duration: 0.3,
            opacity: 0,
            x: 50,
            ease: "power2.in",
            onComplete: () => {
              this.listeGym = this.listeGym.filter(gym => gym.id !== id);
            }
          });
        } else {
          this.listeGym = this.listeGym.filter(gym => gym.id !== id);
        }
      },
      error: (err) => {
        this.toastService.errorToast(err.error.message, 'Erreur');
      }
    });
  }
}

  filterPrix(e: any) {
    switch (e.target.value) {
      case "1": {
        this.salleDeSportService.getGymSoetedAsc().subscribe(
          (data) => {
            this.listeGym = data;
            this.animateListUpdate();
          });
        break;
      }
      case "2": {
        this.salleDeSportService.getGymSoetedDesc().subscribe(
          (data) => {
            this.listeGym = data;
            this.animateListUpdate();
          });
        break;
      }
    }
  }


  findGymWithLettre(searchGym: any) {
    return this.salleDeSportService.getGymWithLettre(searchGym).subscribe(
      (data) => {
        this.listeGym = data;
        this.animateListUpdate();
      });
  }
}
