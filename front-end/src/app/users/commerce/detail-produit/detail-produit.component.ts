import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { produit } from "../../../model/produit";
import { ProduitserviceService } from "../../../shared-service/ProduitService/produitservice.service";
import { UserService } from "../../../shared-service/userService/user.service";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;
  imageProd: any;
  selectedFile!: File;
  pro!: produit;
  idProduit!: string;
  private swiper!: Swiper;

  constructor(
    private prodser: ProduitserviceService,
    private ac: ActivatedRoute,
    private userService: UserService
  ) {
    this.idProduit = this.ac.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.loadProduct();
    this.loadProductImages();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.initSwiper();
  }

  private loadProduct(): void {
    this.prodser.getOneProduct(this.idProduit).subscribe({
      next: (data) => {
        this.pro = data;
        // Fix for the TypeScript error by converting Number to number if needed
        if (typeof this.pro.quantite === 'object') {
          this.pro.quantite = (this.pro.quantite as Number).valueOf();
        }
        console.log(this.pro);
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  private loadProductImages(): void {
    this.prodser.getImagesProduits(this.idProduit).subscribe({
      next: (data) => {
        this.imageProd = data.images;
        // Re-init swiper after images load if needed
        if (this.swiper) {
          setTimeout(() => this.swiper.update(), 100);
        }
      },
      error: (err) => console.error('Error loading product images:', err)
    });
  }

  private initSwiper(): void {
    setTimeout(() => {
      this.swiper = new Swiper(this.carousel.nativeElement, {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      });
    }, 300);
  }

  private initAnimations(): void {
    // GSAP animations
    gsap.from(".swiper-container", {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".product-details", {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });

    // Scroll animations for info cards
    gsap.utils.toArray(".feature-card").forEach((card: any, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.7)"
      });
    });
  }

  onFileChanged(e: any): void {
    this.selectedFile = e.target.files[0];
  }

  onUpload(): void {
    const uploadData = new FormData();
    uploadData.append('image_name', this.selectedFile, this.selectedFile.name);

    this.userService.onUpload(uploadData).subscribe({
      next: (result) => console.log(result),
      error: (err) => console.log(err)
    });
  }

  addToCart(): void {
    // Implement cart functionality
    console.log('Added to cart:', this.pro);
  }

  addToWishlist(): void {
    // Implement wishlist functionality
    console.log('Added to wishlist:', this.pro);
  }
}
