import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AnnonceService} from "../../../shared-service/AnnonceService/annonce.service";
import {Annonce} from "../../../model/annonce";

@Component({
  selector: 'app-item-annonce',
  templateUrl: './item-annonce-coach.component.html',
  styleUrls: ['./item-annonce-coach.component.css']
})
export class ItemAnnonceCoachComponent implements OnInit {
    @ViewChild('annonceCard', { static: false }) annonceCard!: ElementRef;

@Input() annonce:any

  ngAfterViewInit() {
  if (this.annonceCard?.nativeElement) {
    // Only animate if parent container has finished animating
    const container = this.annonceCard.nativeElement.closest('.announcement-container');
    if (container && container.style.opacity === '1') {
      this.initAnimations();
    } else {
      // Wait for parent animation to complete
      const observer = new MutationObserver((mutations) => {
        if (container.style.opacity === '1') {
          this.initAnimations();
          observer.disconnect();
        }
      });
      observer.observe(container, { attributes: true });
    }
  }
}

  initAnimations() {
    gsap.from(this.annonceCard.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      delay: Math.random() * 0.3
    });

    // Hover animation
    this.annonceCard.nativeElement.addEventListener('mouseenter', () => {
      gsap.to(this.annonceCard.nativeElement, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    this.annonceCard.nativeElement.addEventListener('mouseleave', () => {
      gsap.to(this.annonceCard.nativeElement, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }




  ngOnInit(): void {

  }

}
