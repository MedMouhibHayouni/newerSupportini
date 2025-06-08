import { Component, OnInit } from '@angular/core';
import { sallesport } from "../../model/salleDeSport";
import { User } from "../../model/user";
import { SalleDeSportService } from "../../shared-service/salleDeSportService/salle-de-sport.service";
import { UserService } from "../../shared-service/userService/user.service";
import { Subscription } from "rxjs";
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-list-salle-de-sport',
  templateUrl: './list-salle-de-sport.component.html',
  styleUrls: ['./list-salle-de-sport.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s {{delay}}s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: 0 } })
    ])
  ]
})
export class ListSalleDeSportComponent implements OnInit {
  id!: any;
  searchGym!: string;
  listeGym!: sallesport[];
  user!: User;
  imageVitrine!: any;
  private subscriptionUser: Subscription;

  constructor(
    private salleDeSportService: SalleDeSportService,
    private userService: UserService
  ) {
    this.subscriptionUser = this.userService.selectFromStore((state: any) => state).subscribe((res) => { this.user = res });
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.user = new User();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.salleDeSportService.getAllGym().subscribe(
      (data) => { this.listeGym = data.gyms; }
    );
  }

  ngAfterViewInit() {
    // GSAP animations for hero section
    gsap.from('.hero-title', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.hero-description', {
      duration: 1,
      y: 20,
      opacity: 0,
      delay: 0.3,
      ease: 'power3.out'
    });

    // Scroll animations for gym cards
    gsap.utils.toArray('.gym-card').forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1)"
      });
    });
  }

  filterPrix(e: any) {
    switch (e.target.value) {
      case "1": {
        this.salleDeSportService.getGymSoetedAsc().subscribe(
          (data) => this.listeGym = data);
      } break;
      case "2": {
        this.salleDeSportService.getGymSoetedDesc().subscribe(
          (data) => { this.listeGym = data; console.log(this.listeGym) });
      }
    }
  }

  findGymWithLettre(searchGym: any) {
    return this.salleDeSportService.getGymWithLettre(searchGym).subscribe(
      (data) => { this.listeGym = data; console.log(data) });
  }

  ngOnDestroy() {
    this.subscriptionUser.unsubscribe();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
