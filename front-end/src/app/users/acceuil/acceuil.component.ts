import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';


@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.initScrollAnimations();
  }

  private initAnimations(): void {
    // Hero section animations
    this.animateHeroSection();

    // Animate floating circles
    this.animateFloatingCircles();

    // Video parallax effect
    this.setupVideoParallax();
  }

  private initScrollAnimations(): void {
    // Stats counter animation
    this.animateStatsCounter();

    // Features animation
    this.animateFeatures();

    // Services animation
    this.animateServices();

    // Testimonials animation
    this.animateTestimonials();

    // Pricing animation
    this.animatePricing();
  }

  private animateHeroSection(): void {
    // Hero badge animation
    gsap.from('#hero-badge', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: 0.3
    });

    // Headline animation
    gsap.from('#headline-part1', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.from('#headline-part2', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.8
    });

    // Hero text animation
    gsap.to('#hero-text', {
      duration: 1,
      opacity: 1,
      x: 20,
      ease: 'power2.out',
      delay: 1.3
    });

    // Buttons animation
    gsap.to('#hero-buttons', {
      duration: 1,
      opacity: 1,
      y: -20,
      ease: 'power2.out',
      delay: 1.6
    });

    // Users animation
    gsap.to('#hero-users', {
      duration: 1,
      opacity: 1,
      y: -20,
      ease: 'power2.out',
      delay: 1.9
    });

    // Scroll indicator animation
    gsap.from('#scroll-indicator', {
      duration: 2,
      y: -20,
      opacity: 0,
      ease: 'power1.inOut',
      delay: 2.5,
      repeat: -1,
      yoyo: true
    });
  }

  private animateFloatingCircles(): void {
    // Floating circle animations
    gsap.to('.animate-float-1', {
      duration: 8,
      y: '+=40',
      x: '+=30',
      rotation: '+=360',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to('.animate-float-2', {
      duration: 10,
      y: '+=50',
      x: '-=40',
      rotation: '-=360',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to('.animate-float-3', {
      duration: 12,
      y: '-=60',
      x: '+=50',
      rotation: '+=180',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }

  private setupVideoParallax(): void {
    gsap.to('#hero-video', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 100,
      scale: 1.05,
      ease: 'none'
    });
  }

  private animateStatsCounter(): void {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: '#stats',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: index * 0.2
      });
    });

    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
      const dataTarget = counter.getAttribute('data-target');
      const target = dataTarget !== null ? +dataTarget : 0;
      const count = +(counter as HTMLElement).innerText;
      const increment = target / speed;

      const updateCount = () => {
        const currentCount = +(counter as HTMLElement).innerText;

        if (currentCount < target) {
          (counter as HTMLElement).innerText = Math.ceil(currentCount + increment).toString();
          setTimeout(updateCount, 1);
        } else {
          (counter as HTMLElement).innerText = target.toString();
        }
      };

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: updateCount,
        once: true
      });
    });
  }

  private animateFeatures(): void {
    gsap.utils.toArray('.feature-item').forEach((item: any, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
        ease: 'power2.out',
        delay: index * 0.15
      });
    });

    gsap.from('.features-image', {
      scrollTrigger: {
        trigger: '.features-image',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      scale: 0.9,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.feature-badge', {
      scrollTrigger: {
        trigger: '.feature-badge',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      duration: 0.8,
      y: 30,
      rotation: -15,
      opacity: 0,
      ease: 'back.out(1.7)'
    });
  }

  private animateServices(): void {
    gsap.utils.toArray('.service-card').forEach((card: any, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: '#services',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: index * 0.15
      });
    });
  }

  private animateTestimonials(): void {
    gsap.utils.toArray('.testimonial-card').forEach((card: any, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: index * 0.15
      });
    });
  }

  private animatePricing(): void {
    gsap.utils.toArray('.pricing-card').forEach((card: any, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: index * 0.15
      });
    });
  }
}
