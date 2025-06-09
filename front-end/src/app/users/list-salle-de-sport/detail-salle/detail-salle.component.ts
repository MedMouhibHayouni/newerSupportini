import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { User } from "../../../model/user";
import { ToastService } from "../../../shared-service/toastService/toast.service";
import { SalleDeSportService } from "../../../shared-service/salleDeSportService/salle-de-sport.service";
import { UserService } from "../../../shared-service/userService/user.service";
import { sallesport } from "../../../model/salleDeSport";
import { materielSalle } from "../../../model/materielSalle";
import { EquipementGymService } from "../../../shared-service/materialSalleService/equipement-gym.service";

@Component({
  selector: 'app-detail-salle',
  templateUrl: './detail-salle.component.html',
  styleUrls: ['./detail-salle.component.scss']
})
export class DetailSalleComponent implements OnInit {
  imagesGym: any[] = [];
  currentImageIndex = 0;
  isChangingImage = false;
  idGym: number;
  user!: User;
  gym!: sallesport;
  equipment: materielSalle[] = [];
  equipments: materielSalle = new materielSalle();
  newEquipment: materielSalle = new materielSalle();
  selectedEquipmentImage?: File;
  showAddEquipmentModal = false;
  showEditEquipmentModal = false;
  safeMapUrl: SafeResourceUrl;

  pricingPlans = [
    { duration: '1 month', price: 0, popular: false },
    { duration: '3 months', price: 120, popular: false },
    { duration: '6 months', price: 250, popular: true },
    { duration: '12 months', price: 400, popular: false }
  ];

  constructor(
    private toastService: ToastService,
    private salleDeSportService: SalleDeSportService,
    private ac: ActivatedRoute,
    private userService: UserService,
    private equipementGymService: EquipementGymService,
    private sanitizer: DomSanitizer
  ) {
    this.idGym = this.ac.snapshot.params["id"];
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.757473652379!2d8.695635715621231!3d36.17245591048149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fba5ae0812500b%3A0x87be404701aaef06!2sGolden%20Gym%20Le%20Kef!5e0!3m2!1sfr!2sin!4v1670438020841!5m2!1sfr!2sin"
    );
  }

  ngOnInit(): void {
    this.user = this.userService.getUser() || JSON.parse(localStorage.getItem("user") || '{}');
    this.loadGymData();
  }

  private loadGymData(): void {
    this.salleDeSportService.getGymById(this.idGym).subscribe({
      next: (data) => {
        this.gym = data.gym;
        this.equipment = data.equipment;
        this.pricingPlans[0].price = Number(this.gym.prix) || 0;

        this.loadGymImages();
        this.loadEquipment();
      },
      error: (err) => {
        this.toastService.errorToast("Failed to load gym data", "Error");
      }
    });
  }

  private loadGymImages(): void {
    this.salleDeSportService.getImagesGym(this.gym.id).subscribe({
      next: (data) => {
        this.imagesGym = data.images || [];
      },
      error: (err) => {
        this.toastService.errorToast("Failed to load gym images", "Error");
      }
    });
  }

  private loadEquipment(): void {
    this.equipementGymService.getEquipementGym(this.gym.id).subscribe({
      next: (data) => {
        this.equipment = data.equipement || [];
      },
      error: (err) => {
        this.toastService.errorToast("Failed to load equipment", "Error");
      }
    });
  }

  // Image Gallery Methods
  nextImage(): void {
    this.changeImage((this.currentImageIndex + 1) % this.imagesGym.length);
  }

  prevImage(): void {
    this.changeImage((this.currentImageIndex - 1 + this.imagesGym.length) % this.imagesGym.length);
  }

  goToImage(index: number): void {
    if (index !== this.currentImageIndex) {
      this.changeImage(index);
    }
  }

  private changeImage(newIndex: number): void {
    this.isChangingImage = true;
    setTimeout(() => {
      this.currentImageIndex = newIndex;
      this.isChangingImage = false;
    }, 250);
  }

  getImageUrl(imageVitrine: string): string {
    return `http://localhost:8080/public/images/salleDeSport/${imageVitrine}`;
  }

  handleImageError(): void {
    console.error('Failed to load gym image');
  }

  // Equipment Methods
  getEquipmentImageUrl(imageVitrine: string): string {
    return `http://localhost:8080/public/images/materielSalleDeSport/${imageVitrine}`;
  }

  handleEquipmentImageError(equipment: materielSalle): void {
    console.error('Failed to load equipment image', equipment);
    // You could set a default image here if desired
  }

  onEquipmentImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedEquipmentImage = file;
    }
  }

  // Modal Methods
  openAddEquipmentModal(): void {
    this.newEquipment = new materielSalle();
    this.showAddEquipmentModal = true;
  }

  closeAddEquipmentModal(): void {
    this.showAddEquipmentModal = false;
  }

  openEditEquipmentModal(equipment: materielSalle): void {
    this.equipments = { ...equipment };
    this.showEditEquipmentModal = true;
  }

  closeEditEquipmentModal(): void {
    this.showEditEquipmentModal = false;
  }

  // Form Submission Methods
  addEquipment(): void {
    const formData = new FormData();
    if (this.selectedEquipmentImage) {
      formData.append('imageVitrine', this.selectedEquipmentImage);
    }
    formData.append('nomMaterial', this.newEquipment.nomMaterial || '');
    formData.append('specialite', this.newEquipment.specialite || '');
    formData.append('description', this.newEquipment.description || '');

    this.equipementGymService.getCreateEquipementGym(this.gym.id, formData).subscribe({
      next: (res) => {
        this.toastService.successToast("Equipment added successfully", "Success");
        this.loadEquipment();
        this.closeAddEquipmentModal();
      },
      error: (err) => {
        this.toastService.errorToast("Failed to add equipment", "Error");
      }
    });
  }

  updateEquipment(): void {
    const formData = new FormData();
    if (this.selectedEquipmentImage) {
      formData.append('imageVitrine', this.selectedEquipmentImage);
    }
    formData.append('nomMaterial', `${this.equipments.nomMaterial || ''}`);
    formData.append('specialite', this.equipments.specialite || '');
    formData.append('description', this.equipments.description || '');

    this.equipementGymService.putUpdateEquipementGym(this.equipments.id || 0, formData).subscribe({
      next: (res) => {
        this.toastService.successToast("Equipment updated successfully", "Success");
        this.loadEquipment();
        this.closeEditEquipmentModal();
      },
      error: (err) => {
        this.toastService.errorToast("Failed to update equipment", "Error");
      }
    });
  }
}
