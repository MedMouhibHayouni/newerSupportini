import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../shared-service/userService/user.service";
import { User } from "../../../model/user";
import { SuiviServiceService } from "../../../shared-service/suiviService/suivi-service.service";
import { FeedbackService } from "../../../shared-service/feedbackService/feedback.service";
import { Suivis } from "../../../model/Suivis";
import { gsap } from 'gsap';

@Component({
  selector: 'app-suivi-trainer',
  templateUrl: './suivi-trainer.component.html',
  styleUrls: ['./suivi-trainer.component.css'],
})
export class SuiviTrainerComponent implements OnInit {
  @ViewChild('bmiDialog') bmiDialog!: ElementRef;
  @ViewChild('addSuiviDialog') addSuiviDialog!: ElementRef;

  user!: any;
  su!: any;
  suivisEntr!: any;
  feedbackByIdSuivi!: any;
  weightCalcul: any;
  heightCalcul: any;
  bmiCalcul: any;
  bmiValue: any;
  showBmiDialog = false;
  showAddSuiviDialog = false;

  constructor(
    private router: Router,
    private act: ActivatedRoute,
    private userService: UserService,
    private suiviService: SuiviServiceService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.suiviService.getSuiviByIdEntr().subscribe((data) => {
      this.suivisEntr = data.suivis;
      this.feedbackService.getOneFeedbackByIdSuivi(this.suivisEntr.id).subscribe((dataset) => {
        this.feedbackByIdSuivi = dataset.feedbackBySuivi;
      });
    });

    this.user = this.userService.getUser() || JSON.parse(localStorage.getItem("user") || '{}');
    this.initAnimations();
  }

  initAnimations() {
    gsap.from(".stats-card", {
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    gsap.from(".floating-btn", {
      duration: 0.8,
      scale: 0,
      rotation: 180,
      ease: "elastic.out(1, 0.5)"
    });
  }

  openBmiDialog() {
    this.showBmiDialog = true;
    gsap.from(this.bmiDialog.nativeElement, {
      duration: 0.3,
      scale: 0.8,
      opacity: 0,
      ease: "back.out(1.7)"
    });
  }

  openAddSuiviDialog() {
    this.showAddSuiviDialog = true;
    gsap.from(this.addSuiviDialog.nativeElement, {
      duration: 0.3,
      scale: 0.8,
      opacity: 0,
      ease: "back.out(1.7)"
    });
  }

  closeDialog() {
    this.showBmiDialog = false;
    this.showAddSuiviDialog = false;
  }

  addSuivi() {
    const tailleInputs = document.getElementById('tailleInput') as HTMLInputElement | null;
    const poidsInputs = document.getElementById('poidsInput') as HTMLInputElement | null;

    this.suiviService.getSuiviByIdEntr().subscribe((data) => {
      this.su = data.suivis;
      const taille = Number(tailleInputs?.value);
      const poids = Number(poidsInputs?.value);
      const suiviModele = new Suivis();
      suiviModele.taille = taille;
      suiviModele.poids = poids;

      this.suiviService.addSuivi(this.su.fk_id_coach, suiviModele).subscribe(() => {
        this.closeDialog();
        // Add success animation
        gsap.to(".success-message", {
          duration: 0.5,
          opacity: 1,
          y: 0,
          onComplete: () => {
            gsap.to(".success-message", {
              duration: 0.5,
              opacity: 0,
              y: -20,
              delay: 2
            });
          }
        });
      });
    });
  }

  calculateBMI() {
    let height = this.heightCalcul;
    let weight = this.weightCalcul;
    let finalBmi = weight / (height / 100 * height / 100);
    this.bmiValue = parseFloat(finalBmi.toFixed(2));
    this.setBMIMessage();

    // Animate BMI needle
    this.animateBmiNeedle(this.bmiValue);
  }

  private animateBmiNeedle(bmiValue: number) {
    const angle = this.calculateNeedleAngle(bmiValue);
    gsap.to("#needle", {
      duration: 1,
      rotation: angle,
      transformOrigin: "bottom center",
      ease: "elastic.out(1, 0.5)"
    });
  }

  private calculateNeedleAngle(bmiValue: number): number {
    if (bmiValue < 18.5) return -45; // Underweight
    if (bmiValue >= 18.5 && bmiValue < 25) return 0; // Normal
    if (bmiValue >= 25 && bmiValue < 30) return 45; // Overweight
    return 90; // Obese
  }

  private setBMIMessage() {
    if (this.bmiValue < 18.5) {
      this.bmiCalcul = "Underweight";
    } else if (this.bmiValue >= 18.5 && this.bmiValue < 25) {
      this.bmiCalcul = "Normal";
    } else if (this.bmiValue >= 25 && this.bmiValue < 30) {
      this.bmiCalcul = "Overweight";
    } else {
      this.bmiCalcul = "Obese";
    }
  }
}
