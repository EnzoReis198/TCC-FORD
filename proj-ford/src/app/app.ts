import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common'; // ⬅️ importa aqui

@Component({
  selector: 'app-root',
  standalone: true, // <== Adiciona isso
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [NgIf] // <== Isso agora vai funcionar
})

export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('videoBg') videoBgRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('videoSource') videoSourceRef?: ElementRef<HTMLSourceElement>;
  @ViewChild('hamburger') hamburgerRef?: ElementRef<HTMLElement>;
  @ViewChild('leftCover') leftCoverRef?: ElementRef<HTMLElement>;
  @ViewChild('rightCover') rightCoverRef?: ElementRef<HTMLElement>;
  @ViewChild('overlay') overlayRef?: ElementRef<HTMLElement>;
  @ViewChild('nav') navRef?: ElementRef<HTMLElement>;
  @ViewChild('videoContainer') videoContainerRef?: ElementRef<HTMLElement>;
  @ViewChild('cursorDot') cursorDotRef?: ElementRef<HTMLElement>;
  @ViewChild('cursorTrail') cursorTrailRef?: ElementRef<HTMLElement>;

  @ViewChildren('carouselItem') carouselItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carDescription') carDescriptions!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carouselSlide') carouselSlides!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carouselDot') carouselDots!: QueryList<ElementRef<HTMLElement>>;

  private mouseX = 0;
  private mouseY = 0;
  private trailX = 0;
  private trailY = 0;
  private animationFrameId: number | null = null;

  currentMiniSlide = 0;

  private listeners: (() => void)[] = [];

  constructor(private renderer: Renderer2, private router: Router) {}


  ngAfterViewInit(): void {
    const videoBg = this.videoBgRef?.nativeElement;
    const videoSource = this.videoSourceRef?.nativeElement;
    const hamburger = this.hamburgerRef?.nativeElement;
    const leftCover = this.leftCoverRef?.nativeElement;
    const nav = this.navRef?.nativeElement;
    const overlay = this.overlayRef?.nativeElement;
    const cursorDot = this.cursorDotRef?.nativeElement;
    const cursorTrail = this.cursorTrailRef?.nativeElement;

    if (!videoBg || !videoSource || !hamburger || !leftCover || !nav || !overlay || !cursorDot || !cursorTrail) {
      console.error('Elementos do DOM não encontrados. Verifique seus ViewChilds.');
      return;
    }

    // Tenta dar play no vídeo logo após init
    setTimeout(() => {
      videoBg.muted = true;
      videoBg.play().catch(err => {
        console.warn('Erro autoplay vídeo:', err);
      });
    }, 100);
    
    // --- Carrossel principal ---
    this.carouselItems.forEach((itemRef, index) => {
      const nativeItem = itemRef.nativeElement;
      const listener = this.renderer.listen(nativeItem, 'click', () => {
        const videoSrc = nativeItem.dataset['video'];
        if (!videoSrc) return;

        // Atualiza item ativo do carrossel
        this.carouselItems.forEach(i => i.nativeElement.classList.remove('active'));
        nativeItem.classList.add('active');

        // Atualiza descrição ATUALMENTE (não esperar o vídeo)
        this.carDescriptions.forEach(desc => desc.nativeElement.classList.remove('active'));
        this.carDescriptions.toArray()[index]?.nativeElement.classList.add('active');

        // Troca vídeo
        videoBg.classList.add('fading-out');
        videoBg.pause();

        setTimeout(() => {
          videoSource.src = 'assets/' + videoSrc;
          videoBg.load();

          videoBg.oncanplay = () => {
            videoBg.play();
            videoBg.classList.remove('fading-out');
            videoBg.oncanplay = null;
          };
        }, 600);

        this.onCarChange(index);
      });
      this.listeners.push(listener);
    });

    // Ativa primeira descrição
    setTimeout(() => {
      this.carDescriptions.first?.nativeElement.classList.add('active');
    }, 500);

    // --- Menu hambúrguer ---
    const openMenu = () => {
      leftCover.classList.add('active');
      hamburger.classList.add('open');
      hamburger.style.position = 'fixed';
      hamburger.style.zIndex = '2000';
      hamburger.style.left = '30px';
      hamburger.style.top = '30px';
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      leftCover.classList.remove('active');
      hamburger.classList.remove('open');
      hamburger.style.position = '';
      hamburger.style.zIndex = '';
      hamburger.style.left = '';
      hamburger.style.top = '';
      document.body.style.overflow = '';
    };

    this.listeners.push(this.renderer.listen(hamburger, 'click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    }));

    this.listeners.push(this.renderer.listen(overlay, 'click', () => {
      closeMenu();
    }));

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onEsc);
    this.listeners.push(() => document.removeEventListener('keydown', onEsc));

    // --- Cursor customizado ---
    const onMouseMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      cursorDot.style.top = `${this.mouseY}px`;
      cursorDot.style.left = `${this.mouseX}px`;
      cursorDot.style.opacity = '1';
      cursorTrail.style.opacity = '1';
    };
    const onMouseLeave = () => {
      cursorDot.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    };

    // Usa listeners globais no documento para o cursor sempre funcionar
    this.listeners.push(this.renderer.listen('document', 'mousemove', onMouseMove));
    this.listeners.push(this.renderer.listen('document', 'mouseleave', onMouseLeave));

    // Animação do cursor trail
    const animateTrail = () => {
      this.trailX += (this.mouseX - this.trailX) * 0.15;
      this.trailY += (this.mouseY - this.trailY) * 0.15;
      cursorTrail.style.top = `${this.trailY}px`;
      cursorTrail.style.left = `${this.trailX}px`;
      this.animationFrameId = requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Scroll nav
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    this.listeners.push(() => window.removeEventListener('scroll', onScroll));
  }

  ngOnDestroy(): void {
    this.listeners.forEach(remove => {
      if (typeof remove === 'function') remove();
    });
    this.listeners = [];

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onCarChange(index: number): void {
    console.log('Carro trocado para índice:', index);
  }

  goToSlide(index: number): void {
    this.currentMiniSlide = index;

    this.carouselSlides.forEach((slide, i) => {
      slide.nativeElement.classList.toggle('active', i === index);
    });

    this.carouselDots.forEach((dot, i) => {
      dot.nativeElement.classList.toggle('active', i === index);
    });
  }




isMenuOpen = false;
isLoggedIn = false;
userName = '';

toggleUserMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

irParaLogin() {
  this.isMenuOpen = false;
  this.router.navigate(['/login']);
}


logout() {
  this.isLoggedIn = false;
  this.userName = '';
  this.isMenuOpen = false;
}


  showLoader = true;

  ngOnInit() {
    // Simula carregamento por 2 segundos
    setTimeout(() => {
      this.showLoader = false;
    }, 2000);
  }




}




