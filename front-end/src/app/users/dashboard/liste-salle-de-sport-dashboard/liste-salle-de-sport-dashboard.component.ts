import { Component, OnInit } from '@angular/core';
import {SalleDeSportService} from "../../../shared-service/salleDeSportService/salle-de-sport.service";
import {sallesport} from "../../../model/salleDeSport";

@Component({
  selector: 'app-liste-salle-de-sport-dashboard',
  templateUrl: './liste-salle-de-sport-dashboard.component.html',
  styleUrls: ['./liste-salle-de-sport-dashboard.component.scss']
})
export class ListeSalleDeSportDashboardComponent implements OnInit {
  responsiveOptions;
  empty!:boolean
  public listGyms! :sallesport[];
  constructor(private  salleDeSportService:SalleDeSportService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
  ngOnInit() {
    this.salleDeSportService.getLastFiveGym().subscribe(
      {
        next:(result)=>{this.listGyms=result.fiveGyms;
          console.log(this.listGyms)
          this.empty=result.empty
        },
        error:(err)=>{this.empty=err.empty
        },
        complete:()=>{}
      }
    )

  }

  // Add to existing component
ngAfterViewInit(): void {
  if (!this.empty) {
    this.initAnimations();
  }
}

initAnimations(): void {
  gsap.utils.toArray('app-iteam-salle-dashboard').forEach((card: any, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out"
    });
  });
}
}
