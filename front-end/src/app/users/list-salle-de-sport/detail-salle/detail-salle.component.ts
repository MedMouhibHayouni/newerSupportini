import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../model/user';
import { ToastService } from '../../../shared-service/toastService/toast.service';
import { SalleDeSportService } from '../../../shared-service/salleDeSportService/salle-de-sport.service';
import { UserService } from '../../../shared-service/userService/user.service';
import { sallesport } from '../../../model/salleDeSport';
import { materielSalle } from '../../../model/materielSalle';
import { EquipementGymService } from '../../../shared-service/materialSalleService/equipement-gym.service';

declare var $: any;

declare var window: any;

@Component({
  selector: 'app-detail-salle',
  templateUrl: './detail-salle.component.html',
  styleUrls: ['./detail-salle.component.scss'],
})
export class DetailSalleComponent implements OnInit {
@ViewChild('addEquipmentDialog', { static: false })
  addEquipmentDialog!: ElementRef;

  imagesGym: any;
  idGym: number;
  user!: User;
  selectedFile!: File;
  previews: string[] = [];
  gym!: sallesport;
  equipment!: materielSalle[];
  equipments: materielSalle = new materielSalle();
  formModal: any;
  selectedFiles!: FileList;
  size = '1400-933';
  mainImage: string = '';

  private lightGallery!: LightGallery;
  private needRefresh = false;

   constructor(
    private toastService: ToastService,
    private salleDeSportService: SalleDeSportService,
    private ac: ActivatedRoute,
    private userService: UserService,
    private equipementGymService: EquipementGymService,
    private router: Router
  ) {
    this.idGym = Number(this.ac.snapshot.params["id"]); // Convert to number
    gsap.registerPlugin(ScrollTrigger);
  }

   ngOnInit(): void {
    this.user = this.userService.getUser() || JSON.parse(localStorage.getItem("user") || '{}');
    this.loadEquipment(this.idGym);
  }

  ngAfterViewInit() {
    // GSAP animations for hero section
    gsap.from('.gym-header', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    // Scroll animations for sections
    gsap.utils.toArray('.section').forEach((section: any, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "back.out(1)"
      });
    });
  }

  changeMainImage(image: string) {
    this.mainImage = image;
  }

  onInit = (detail: any): void => {
    this.lightGallery = detail.instance;
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('exampleModal')
    );
  };
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  getEditGym(gym: sallesport) {
    this.gym = gym;
  }
  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
  }
  onUploadImage(id: any) {
    console.log(id);
    const uploadData = new FormData();
    uploadData.append(
      'imageVitrine',
      this.selectedFile,
      this.selectedFile.name
    );
    this.salleDeSportService.postImageGym(uploadData, id).subscribe();
  }
  updateGym() {
    return this.salleDeSportService
      .putGymUpdate(this.idGym, this.gym)
      .subscribe((data) => {
        this.gym = data.updated;
        this.toastService.successToast('modification avec succès', 'success');
      });
  }
  // updateImageGym(){
  //   return this.salleDeSportService.postImageGym(this.idGym,this.imagesGym).subscribe()
  // }
  addEquipementGym(idGym: number) {
  // Create FormData object
  const formData = new FormData();

  // Append the file
  if (this.selectedFile) {
    formData.append('imageVitrine', this.selectedFile, this.selectedFile.name);
  } else {
    this.toastService.errorToast('Please select an image', 'Error');
    return;
  }

  // Get form values
  const nomMaterial = (document.getElementById('nomEquipement') as HTMLInputElement).value;
  const specialite = (document.getElementById('discipline') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLInputElement).value;

  // Append other form data
  formData.append('nomMaterial', nomMaterial);
  formData.append('specialite', specialite);
  formData.append('description', description);
  formData.append('quantite', '1'); // Default quantity if needed

  this.equipementGymService.createEquipment(idGym, formData).subscribe({
    next: (result) => {
      this.toastService.successToast('Equipment added successfully', 'Success');
      this.closeAddEquipmentDialog();
      this.loadEquipment(idGym); // Refresh the equipment list
    },
    error: (err) => {
      console.error('Error adding equipment:', err);
      this.toastService.errorToast(
        err.error?.message || 'Error adding equipment',
        'Error'
      );
    }
  });
}

loadEquipment(gymId: number) {
  this.equipementGymService.getEquipment(gymId).subscribe({
    next: (data) => {
      this.equipment = data;
    },
    error: (err) => {
      console.error('Error loading equipment:', err);
    }
  });
}
  /*updateEquipmentGym() {
    return this.equipementGymService
      .putUpdateEquipementGym(this.idGym, this.equipments)
      .subscribe((data) => {
        this.equipments = data.updated;
        this.toastService.successToast('modification avec succès', 'success');
      });
  }

  editMateriel(materiel: any) {
    this.equipments = materiel;
  }*/


  // Update your openAddEquipmentDialog method
openAddEquipmentDialog(): void {
    const dialog = this.addEquipmentDialog.nativeElement as HTMLDialogElement;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      // Fallback for browsers that don't support dialog.showModal()
      dialog.setAttribute('open', '');
    }
  }


  closeAddEquipmentDialog(): void {
    const dialog = this.addEquipmentDialog.nativeElement as HTMLDialogElement;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      // Fallback for browsers that don't support dialog.close()
      dialog.removeAttribute('open');
    }
  }

  editMateriel(materiel: any): void {
  // Implement your edit logic here
  console.log('Editing material:', materiel);
  // You might want to store the material to edit in a property
  this.equipments = materiel;

  // If you have an edit dialog, you would open it here
  this.openAddEquipmentDialog();
}
// Dialog methods
  openEditGymDialog(): void {
    const dialog = document.getElementById('editGymDialog') as HTMLDialogElement;
    dialog.showModal();
  }

  closeEditGymDialog(): void {
    const dialog = document.getElementById('editGymDialog') as HTMLDialogElement;
    dialog.close();
  }



  openEditEquipmentDialog(materiel: materielSalle): void {
    this.equipments = materiel;
    const dialog = document.getElementById('editEquipmentDialog') as HTMLDialogElement;
    dialog.showModal();
  }

  closeEditEquipmentDialog(): void {
    const dialog = document.getElementById('editEquipmentDialog') as HTMLDialogElement;
    dialog.close();
  }

   updateEquipmentGym() {
    /*return this.equipementGymService.putUpdateEquipementGym(this.idGym, this.equipments).subscribe(
      (data) => {
        this.equipments = data.updated;
        this.toastService.successToast("Modification avec succès", "success");
      });*/
  }



}



