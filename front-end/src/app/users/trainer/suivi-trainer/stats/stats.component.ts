import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Suivis } from "../../../../model/Suivis";
import { SuiviServiceService } from "../../../../shared-service/suiviService/suivi-service.service";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackService } from "../../../../shared-service/feedbackService/feedback.service";
import { Feedback } from "../../../../model/Feedback";
import { ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  suiviss!: any;
  listSuiviByEntr!: any;
  feedbackByIdSuivi!: any;
  getedCoachData: any;
  coachImage: any;

  // Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bbbec2'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bbbec2'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#bbbec2',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: '#2d3748',
        titleColor: '#ffa117',
        bodyColor: '#bbbec2',
        borderColor: '#ffa117',
        borderWidth: 1
      }
    }
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [{
      data: [],
      label: 'BMI',
      backgroundColor: '#ffa117',
      borderColor: '#e69115',
      borderWidth: 1,
      hoverBackgroundColor: '#ffb347'
    }]
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  // Sample recent activities
  recentActivities = [
    { name: 'Weight Training', icon: 'fas fa-dumbbell', date: 'Today', duration: 45, calories: 320 },
    { name: 'Running', icon: 'fas fa-running', date: 'Yesterday', duration: 30, calories: 280 },
    { name: 'Yoga', icon: 'fas fa-spa', date: '2 days ago', duration: 60, calories: 180 }
  ];

  @ViewChild('feedbackModal') feedbackModal!: ElementRef;

  constructor(
    private suiviService: SuiviServiceService,
    private feedbackService: FeedbackService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.suiviService.getSuiviByIdEntr().subscribe((data) => {
      this.suiviss = data?.suivis;
      this.loadCoachFeedback();
    });

    this.suiviService.getSuiviAscByEntr().subscribe((dataset) => {
      const listSuiviByEntr = dataset?.sui;
      if (listSuiviByEntr) {
        this.barChartLabels = listSuiviByEntr.map((a: any) =>
          new Date(a.date_suivi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
        this.barChartData.datasets[0].data = listSuiviByEntr.map((a: any) => a.imc);
      }
    });
  }

  private loadCoachFeedback(): void {
    if (this.suiviss?.id) {
      this.feedbackService.getOneFeedbackByIdSuivi(this.suiviss.id).subscribe((data) => {
        this.feedbackByIdSuivi = data?.feedbackBySuivi;
      });

      if (this.suiviss?.fk_id_coach) {
        this.suiviService.getCoachBySuivi(this.suiviss.fk_id_coach).subscribe((data) => {
          this.getedCoachData = data?.coachInUser;
          this.coachImage = this.getedCoachData?.image_name;
        });
      }
    }
  }

  // Utility methods
  calculateBMI(): number {
    if (this.suiviss?.poids && this.suiviss?.taille) {
      const heightInMeters = this.suiviss.taille / 100;
      return this.suiviss.poids / (heightInMeters * heightInMeters);
    }
    return 0;
  }

  getBMIStatus(): string {
    const bmi = this.calculateBMI();
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  getBMIProgress(): number {
    const bmi = this.calculateBMI();
    // Assuming ideal BMI is 22 (midpoint of normal range)
    return Math.min(Math.max((22 / bmi) * 100, 0), 100);
  }

  calculateFitnessAge(): number {
    // Simple calculation - can be enhanced with real logic
    return this.suiviss?.age ? Math.max(this.suiviss.age - 2, 18) : 0;
  }

  getFeedbackDate(): Date {
    return this.feedbackByIdSuivi?.date ? new Date(this.feedbackByIdSuivi.date) : new Date();
  }

  // UI Interactions
  toggleChartType(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  openFeedbackModal(): void {
    if (this.feedbackByIdSuivi) {
      this.modalService.open(this.feedbackModal, {
        size: 'md',
        centered: true,
        windowClass: 'modal-animate'
      });
    }
  }
}
