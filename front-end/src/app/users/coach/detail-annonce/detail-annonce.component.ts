
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AnnonceService} from "../../../shared-service/AnnonceService/annonce.service";
import {Annonce} from "../../../model/annonce";

import {ActivatedRoute} from "@angular/router";

import {SuiviServiceService} from "../../../shared-service/suiviService/suivi-service.service";
import {UserService} from "../../../shared-service/userService/user.service";
import {Suivis} from "../../../model/Suivis";

import {User} from "../../../model/user";
import {ToastService} from "../../../shared-service/toastService/toast.service";


@Component({
  selector: 'app-detail-annonce',
  templateUrl: './detail-annonce.component.html',
  styleUrls: ['./detail-annonce.component.css']
})
export class DetailAnnonceComponent implements OnInit {
    @ViewChild('annonceImage') annonceImage!: ElementRef;

  // title ='extraqrcode';
  // elementType = NgxQrcodeElementTypes.URL
  // value = 'https://www.facebook.com'

  user!: User
  oneannonce !: Annonce


  userWithProfile!:any;
  infoUser!:any;

  id!:any

  coachInfo!:User
  idCoach!:any
  constructor(private serviceAnnonce : AnnonceService, private ac:ActivatedRoute,private suiviService : SuiviServiceService,private userService : UserService,private toastService : ToastService) {


    this.id  = this.ac.snapshot.params["id"];
  }





    ngOnInit()
  :
    void {

      this.serviceAnnonce.getAnnonceById(this.id).subscribe(
        (data) => {
          this.oneannonce = data.annonceData;
        }
      )
      this.user = this.userService.getUser() || JSON.parse(localStorage.getItem("user") || '{}')

      // this.userID=this.user.id
      //console.log(this.user)

      this.userService.coachByUser().subscribe(
        (data) => {
          this.idCoach = data.idc
          console.log(this.idCoach)
        },
      )
      this.serviceAnnonce.getCoachInformationByIdAnnonce(this.id).subscribe(
        (data) => {
          this.coachInfo = data.CoachInformation;
          console.log(this.coachInfo)
        }
      )


    }

    supprimerAnnonce()
    {

      this.serviceAnnonce.supprimerannonce(this.id).subscribe()
      this.toastService.successToast("Supprimer avec succès", "success")
    }

    participerAndSuivi()
    {

      this.userService.getUserWithProfil().subscribe({
        next: (result) => {
          this.infoUser = result.profil['0']
          this.user = this.infoUser?.utilisateur
          console.log(result)
        },
        error: (err) => {
          this.toastService.errorToast(err.error.message, "Erreur")
        },
        complete: () => {
        }
      })
      this.serviceAnnonce.participerAndSuivi(this.id).subscribe()

    }


 ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    // Image animation
    gsap.from(this.annonceImage.nativeElement, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "power3.out"
    });

    // Section animations
    gsap.utils.toArray(".bg-gray-700").forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%"
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "back.out"
      });
    });
  }

}
