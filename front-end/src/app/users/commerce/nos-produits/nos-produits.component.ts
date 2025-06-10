import { Component, OnInit } from '@angular/core';
import { produit } from "../../../model/produit";
import { ProduitserviceService } from "../../../shared-service/ProduitService/produitservice.service";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-nos-produits',
  templateUrl: './nos-produits.component.html',
  styleUrls: ['./nos-produits.component.css']
})
export class NosProduitsComponent implements OnInit {
  public listeProduit: produit[] = [];
  searchProduit: string = '';
  cartProducts: any[] = [];

  constructor(private produitservice: ProduitserviceService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private loadProducts(): void {
    this.produitservice.getAllProduct().subscribe({
      next: (data) => {
        this.listeProduit = data;
        // Convert Number to number if needed
        this.listeProduit.forEach(prod => {
          if (typeof prod.quantite === 'object') {
            prod.quantite = (prod.quantite as Number).valueOf();
          }
        });
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  private initAnimations(): void {
    gsap.utils.toArray(".group").forEach((card: any, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: i * 0.1,
        ease: "back.out(1.2)"
      });
    });
  }

  filterByName(name: string): void {
    this.produitservice.filterProduitByName(name).subscribe({
      next: (data) => this.listeProduit = data,
      error: (err) => console.error('Error filtering products:', err)
    });
  }

  filterPrix(e: any): void {
    switch (e.target.value) {
      case "1":
        this.produitservice.getProdSoetedAsc().subscribe({
          next: (data) => this.listeProduit = data,
          error: (err) => console.error('Error sorting products:', err)
        });
        break;
      case "2":
        this.produitservice.getSortedProdWithPriceDesc().subscribe({
          next: (data) => this.listeProduit = data,
          error: (err) => console.error('Error sorting products:', err)
        });
        break;
      default:
        this.loadProducts();
    }
  }

  AjouterauPanier(event: any): void {
    if ("cart" in localStorage) {
      this.cartProducts = JSON.parse(localStorage.getItem("cart")!);
      let exist = this.cartProducts.find(item => item.item.id == event.item.id);
      if (exist) {
        alert("Ce produit est déjà dans votre panier");
      } else {
        this.cartProducts.push(event);
        localStorage.setItem("cart", JSON.stringify(this.cartProducts));
        this.showAddToCartNotification(event.item.nomproduit);
      }
    } else {
      this.cartProducts.push(event);
      localStorage.setItem("cart", JSON.stringify(this.cartProducts));
      this.showAddToCartNotification(event.item.nomproduit);
    }
  }

  private showAddToCartNotification(productName: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[#ffa117] text-[#22252a] px-4 py-2 rounded-md shadow-lg flex items-center';
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      ${productName} ajouté au panier
    `;

    document.body.appendChild(notification);

    // Animate in
    gsap.from(notification, {
      y: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    // Remove after delay
    setTimeout(() => {
      gsap.to(notification, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => notification.remove()
      });
    }, 3000);
  }
}
