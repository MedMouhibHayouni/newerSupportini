import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Annonce } from '../../../model/annonce';
import { AnnonceService } from '../../../shared-service/AnnonceService/annonce.service';
import { User } from '../../../model/user';
@Component({
  selector: 'app-liste-annonce-coach',
  templateUrl: './list-announce-coach.component.html',
  styleUrls: ['./list-announce-coach.component.css'],
})
export class ListAnnounceCoachComponent implements OnInit {
public listAnnonces: Annonce[] = []; // Initialize as empty array
  user!: User;
  annonceRech = {
    ville: '',
    type: '',
    discipline: '',
  };
  constructor(private annonceservice: AnnonceService) {}

  ngOnInit(): void {
    this.loadAnnonces();
    this.user = JSON.parse(localStorage.getItem('user')!);


  }

loadAnnonces() {
  this.annonceservice.getAllAnnonces().subscribe({
    next: (response) => {
      console.log('Raw response:', response);

      // Clean the data by removing escaped quotes
      this.listAnnonces = response.map((annonce: any) => {
        return {
          ...annonce,
          titre: this.cleanString(annonce.titre),
          discipline: this.cleanString(annonce.discipline),
          type: this.cleanString(annonce.type),
          rue: this.cleanString(annonce.rue),
          ville: this.cleanString(annonce.ville),
          description: this.cleanString(annonce.description),
          codePostal: this.cleanString(annonce.codePostal)
        };
      });

      console.log('Cleaned annonces:', this.listAnnonces);
    },
    error: (err) => {
      console.error('Error loading annonces:', err);
      this.listAnnonces = [];
    }
  });
}

// Helper method to remove escaped quotes
private cleanString(value: string): string {
  if (!value) return value;
  return value.replace(/^"(.*)"$/, '$1');
}

  filterville(e: any) {
    switch (e.target.value) {
      case 'ariana':
        {
          this.annonceRech.ville = 'ariana';
        }
        break;
      case 'beja':
        {
          this.annonceRech.ville = 'beja';
        }
        break;
      case 'benarous':
        {
          this.annonceRech.ville = 'benarous';
        }
        break;
      case 'bizerte':
        {
          this.annonceRech.ville = 'bizerte';
        }
        break;
      case 'gabes':
        {
          this.annonceRech.ville = 'gabes';
        }
        break;
      case 'gafsa':
        {
          this.annonceRech.ville = 'gafsa';
        }
        break;
      case 'jendouba':
        {
          this.annonceRech.ville = 'jendouba';
        }
        break;
      case 'kairouan':
        {
          this.annonceRech.ville = 'kairouan';
        }
        break;
      case 'kebili':
        {
          this.annonceRech.ville = 'kebili ';
        }
        break;
      case 'kef':
        {
          this.annonceRech.ville = 'kef ';
        }
        break;
      case 'mahdia':
        {
          this.annonceRech.ville = 'mahdia ';
        }
        break;

      case 'manouba':
        {
          this.annonceRech.ville = 'manouba ';
        }
        break;

      case 'medenine':
        {
          this.annonceRech.ville = 'medenine ';
        }
        break;

      case 'monastir':
        {
          this.annonceRech.ville = 'monastir ';
        }
        break;

      case 'Nabeul':
        {
          this.annonceRech.ville = 'Nabeul ';
        }
        break;

      case 'Sfax':
        {
          this.annonceRech.ville = ' Sfax';
        }
        break;

      case 'sidibouzid':
        {
          this.annonceRech.ville = ' sidibouzid';
        }
        break;

      case 'siliana':
        {
          this.annonceRech.ville = 'siliana ';
        }
        break;
      case 'sousse':
        {
          this.annonceRech.ville = 'sousse ';
        }
        break;

      case 'tataouine':
        {
          this.annonceRech.ville = ' tataouine';
        }
        break;

      case 'tozeur':
        {
          this.annonceRech.ville = 'tozeur ';
        }
        break;

      case 'tunis':
        {
          this.annonceRech.ville = ' tunis';
        }
        break;

      case 'zaghouan':
        {
          this.annonceRech.ville = ' zaghouan';
        }
        break;
    }
    console.log(this.annonceRech.ville);
  }

  filterType(e: any) {
    switch (e.target.value) {
      case 'domicile':
        {
          this.annonceRech.type = 'domicile';
        }
        break;
      case 'salle':
        {
          this.annonceRech.type = 'salle';
        }
        break;
      case 'entreprise':
        {
          this.annonceRech.type = 'entreprise';
        }
        break;
      case 'espace':
        {
          this.annonceRech.type = 'espace';
        }
        break;
    }
    console.log(this.annonceRech.type);
  }

  filterDiscipline(e: any) {
    switch (e.target.value) {
      case 'natation':
        {
          this.annonceRech.discipline = 'natation';
        }
        break;
      case 'foot':
        {
          this.annonceRech.discipline = 'foot';
        }
        break;
      case 'equitation':
        {
          this.annonceRech.discipline = 'equitation';
        }
        break;
      case 'gymnastique':
        {
          this.annonceRech.discipline = 'gymnastique';
        }
        break;
    }
    console.log(this.annonceRech.discipline);
  }

  filterAnnonce() {
    this.annonceservice.filter(this.annonceRech).subscribe((data) => {
      console.log(data);
      this.listAnnonces = data.annonces;
    });
  }

  filterPrix(e: any) {
    switch (e.target.value) {
      case '1':
        {
          this.annonceservice
            .prixAnnonceAsc()
            .subscribe((data) => (this.listAnnonces = data));
        }
        break;
      case '2': {
        this.annonceservice.prixAnnonceDesc().subscribe((data) => {
          this.listAnnonces = data;
        });
      }
    }
  }
}
