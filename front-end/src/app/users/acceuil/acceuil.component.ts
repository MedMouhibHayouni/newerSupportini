import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';


@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent{
  @ViewChild('hero', { static: true }) hero!: ElementRef;
  @ViewChild('heroVideo', { static: true }) heroVideo!: ElementRef;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    this.initHeroAnimations();
    this.initScrollAnimations();
    this.initServiceCardAnimations();
    this.initStatCounters();
    this.initTestimonialAnimations();
    this.initContinuousAnimations();
  }

  initHeroAnimations(): void {
    // Hero video parallax effect
    gsap.to(this.heroVideo.nativeElement, {
      scale: 1.2,
      scrollTrigger: {
        trigger: this.hero.nativeElement,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Hero content animations
    const tl = gsap.timeline();

    // Badge animation
    tl.from("#hero-badge", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    });

    // Headline character animation
    tl.from("#headline-part1, #headline-part2", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out"
    }, "-=0.5");

    // Text animation
    tl.to("#hero-text", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8");

    // Buttons animation
    tl.from("#hero-buttons button", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.6");

    // Users animation
    tl.to("#hero-users", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");
  }

  initScrollAnimations(): void {
    // Services section title
    gsap.from("#services-title", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Services subtitle
    gsap.from("#services-subtitle", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      delay: 0.3,
      duration: 0.8,
      ease: "power2.out"
    });

    // Service cards staggered animation
    gsap.from(".service-card", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        toggleActions: "play none none none"
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });
  }

  initServiceCardAnimations(): void {
    // Hover animations for service cards
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(card.querySelector('.service-icon'), {
          rotation: 360,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  initStatCounters(): void {
    // Animate counting numbers
    document.querySelectorAll('.stat-number').forEach(number => {
      const target = parseInt(number.getAttribute('data-target') || '0');
      const suffix = number.getAttribute('data-suffix') || '';

      gsap.to(number, {
        scrollTrigger: {
          trigger: number,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        modifiers: {
          innerText: value => Math.floor(parseFloat(value)) + suffix
        },
        ease: "power1.out"
      });
    });
  }

  initTestimonialAnimations(): void {
    // Testimonial cards animation
    gsap.from(".testimonial-card", {
      scrollTrigger: {
        trigger: ".testimonials",
        start: "top 70%",
        toggleActions: "play none none none"
      },
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });

    // Hover effect for testimonials
    document.querySelectorAll('.testimonial-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          boxShadow: "0 20px 25px -5px rgba(255, 161, 23, 0.1), 0 10px 10px -5px rgba(255, 161, 23, 0.04)",
          duration: 0.3
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "none",
          duration: 0.3
        });
      });
    });
  }

  initContinuousAnimations(): void {
    // Floating circles in hero
    gsap.to(".animate-float-1", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".animate-float-2", {
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });

    gsap.to(".animate-float-3", {
      y: -25,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });

    // Pulse animation for featured elements
    gsap.to(".animate-pulse-slow", {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}
