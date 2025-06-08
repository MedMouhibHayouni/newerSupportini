import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from "../../model/user";
import { UserService } from "../../shared-service/userService/user.service";
import { SuiviServiceService } from "../../shared-service/suiviService/suivi-service.service";
import { ProduitserviceService } from "../../shared-service/ProduitService/produitservice.service";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  user!: User;
  stats: any = {
    seancesThisWeek: 0,
    caloriesBurned: 0,
    monthlyGoalProgress: 0,
    monthlyGoal: 0,
    taille: 0,
    poids: 0,
    age: 0,
    // Coach specific stats
    totalClients: 0,
    activeSessions: 0,
    pendingFeedback: 0
  };
  listeProduit: any[] = [];

  // Chart Configurations
  public barChartOptions = {
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

  // Trainee Charts
  public barChartLabels: string[] = [];
  public barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'IMC',
      backgroundColor: '#ffa117',
      borderColor: '#e69115',
      borderWidth: 1,
      hoverBackgroundColor: '#ffb347'
    }
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public lineChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Poids (kg)',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ];
  public lineChartLabels: string[] = [];
  public lineChartOptions = this.barChartOptions;
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;

  // Coach Charts
  public clientsChartLabels: string[] = [];
  public clientsChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Progrès Clients',
      backgroundColor: '#10b981',
      borderColor: '#0d9c6e',
      borderWidth: 1
    }
  ];
  public clientsChartType: ChartType = 'bar';

  constructor(
    private userService: UserService,
    private suiviService: SuiviServiceService,
    private produitservice: ProduitserviceService
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.loadCommonData();
    this.loadRoleSpecificData();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private loadCommonData(): void {
    // Load products for all users
    this.produitservice.getAllProduct().subscribe({
      next: (data) => {
        this.listeProduit = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  private loadRoleSpecificData(): void {
    if (this.user.fk_idRole === 2) { // Trainee
      this.loadTraineeData();
    } else if (this.user.fk_idRole === 3) { // Coach
      this.loadCoachData();
    }
    // Add other roles as needed
  }

  private loadTraineeData(): void {
    // Load suivi data
    this.suiviService.getSuiviByIdEntr().subscribe({
      next: (data) => {
        this.stats = {
          ...this.stats,
          ...(data?.suivis || {})
        };
      },
      error: (err) => {
        console.error('Error loading suivi data:', err);
      }
    });

    // Load chart data
    this.suiviService.getSuiviAscByEntr().subscribe({
      next: (dataset) => {
        const listSuiviByEntr = dataset?.sui;
        if (listSuiviByEntr) {
          // IMC Chart
          this.barChartData[0].data = listSuiviByEntr.map((a: any) => a.imc);
          this.barChartLabels = listSuiviByEntr.map((a: any) =>
            new Date(a.date_suivi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          );

          // Weight Chart
          this.lineChartData[0].data = listSuiviByEntr.map((a: any) => a.poids);
          this.lineChartLabels = this.barChartLabels;
        }
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
      }
    });
  }

  private loadCoachData(): void {
    // Mock data for coach stats - replace with actual API calls
    this.stats = {
      ...this.stats,
      totalClients: 12,
      activeSessions: 5,
      pendingFeedback: 3
    };

    // Mock data for clients progress chart
    this.clientsChartLabels = ['Client 1', 'Client 2', 'Client 3', 'Client 4'];
    this.clientsChartData[0].data = [75, 85, 60, 90];
  }

  private initAnimations(): void {
    // Animate product cards
    gsap.utils.toArray('.product-card').forEach((card: any, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });

    // Animate quick stats
    gsap.utils.toArray('.quick-stat-card').forEach((card: any, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: index % 2 === 0 ? -20 : 20,
        duration: 0.6,
        delay: index * 0.1,
        ease: "back.out(1.2)"
      });
    });
  }

  calculateIMC(): number {
    if (this.stats.taille > 0 && this.stats.poids > 0) {
      const heightInMeters = this.stats.taille / 100;
      return +(this.stats.poids / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 0;
  }

  searchByName(searchTerm: string) {
    // This will be handled by the list-entr component
  }
}
