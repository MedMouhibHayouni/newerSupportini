import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AnnonceService } from "../../../shared-service/AnnonceService/annonce.service";
import { Annonce } from "../../../model/annonce";
import { gsap } from 'gsap';

@Component({
  selector: 'app-mes-annonce',
  templateUrl: './mes-annonce.component.html',
  styleUrls: ['./mes-annonce.component.scss']
})
export class MesAnnonceComponent implements OnInit, AfterViewInit {
  public listAnnonces: Annonce[] = [];
  private animationInitialized = false;

  constructor(private annonceservice: AnnonceService) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  ngAfterViewInit(): void {
    if (this.listAnnonces.length > 0 && !this.animationInitialized) {
      this.initContainerAnimations();
    }
  }

  loadAnnonces(): void {
    this.annonceservice.getAnnonceByCoach().subscribe({
      next: (data) => {
        this.listAnnonces = data.mesCoaching || [];
        if (this.listAnnonces.length > 0) {
          setTimeout(() => {
            if (!this.animationInitialized) {
              this.initContainerAnimations();
            }
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error loading announcements:', err);
        this.listAnnonces = [];
      }
    });
  }

  initContainerAnimations(): void {
    this.animationInitialized = true;
    const containers = document.querySelectorAll('.announcement-container');

    containers.forEach((container, index) => {
      // Set initial state
      gsap.set(container, { opacity: 0, y: 20 });

      // Animate in
      gsap.to(container, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        onComplete: () => {
          // Now that container is visible, child animations can run
          const card = container.querySelector('app-item-annonce');
          if (card) {
            card.classList.add('animate-in');
          }
        }
      });
    });
  }
}
