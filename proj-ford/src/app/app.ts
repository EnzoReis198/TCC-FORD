import {AfterViewInit,Component,ElementRef,QueryList,Renderer2,ViewChild,ViewChildren,OnDestroy,OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService, UserProfile } from '../services/auth-service'; // Ajuste o caminho conforme seu projeto
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [NgIf]
})
export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('videoBg') private videoBgRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('videoSource') private videoSourceRef?: ElementRef<HTMLSourceElement>;
  @ViewChild('hamburger') private hamburgerRef?: ElementRef<HTMLElement>;
  @ViewChild('leftCover') private leftCoverRef?: ElementRef<HTMLElement>;
  @ViewChild('rightCover') private rightCoverRef?: ElementRef<HTMLElement>;
  @ViewChild('overlay') private overlayRef?: ElementRef<HTMLElement>;
  @ViewChild('nav') private navRef?: ElementRef<HTMLElement>;
  @ViewChild('videoContainer') private videoContainerRef?: ElementRef<HTMLElement>;
  @ViewChild('cursorDot') private cursorDotRef?: ElementRef<HTMLElement>;
  @ViewChild('cursorTrail') private cursorTrailRef?: ElementRef<HTMLElement>;

  @ViewChildren('carouselItem') private carouselItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carDescription') private carDescriptions!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carouselSlide') private carouselSlides!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('carouselDot') private carouselDots!: QueryList<ElementRef<HTMLElement>>;

  private mouseX = 0;
  private mouseY = 0;
  private trailX = 0;
  private trailY = 0;
  private animationFrameId: number | null = null;
  private listeners: (() => void)[] = [];
  private subscriptions: Subscription[] = [];
  private isChangingCar = false;

  currentMiniSlide = 0;

  isMenuOpen = false;
  isLoggedIn = false;
  userProfile: UserProfile | null = null;
  userName = '';

  showLoader = true;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {


    // Checa se já está logado ao abrir app
    this.authService.checkInitialLogin();

    // Subscreve para atualizações de login e perfil
    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      }),
      this.authService.getProfile().subscribe(profile => {
        this.userProfile = profile;
        this.userName = profile ? profile.name : '';
      })
    );
  }

  ngAfterViewInit(): void {
    const videoBg = this.videoBgRef?.nativeElement;
    const videoSource = this.videoSourceRef?.nativeElement;
    const hamburger = this.hamburgerRef?.nativeElement;
    const leftCover = this.leftCoverRef?.nativeElement;
    const nav = this.navRef?.nativeElement;
    const overlay = this.overlayRef?.nativeElement;
    const cursorDot = this.cursorDotRef?.nativeElement;
    const cursorTrail = this.cursorTrailRef?.nativeElement;
    const videoContainer = this.videoContainerRef?.nativeElement;

  const videoFiles = [
    'assets/videos/mustang.mp4',
    'assets/videos/raptor.mp4',
    'assets/videos/sla.mp4'
  ];

  let loadedCount = 0;

  const onAllVideosLoaded = () => {
    this.showLoader = false;
    console.log('Todos os vídeos do carrossel foram carregados!');
    // Agora você pode dar play no vídeo visível normalmente
    const videoBg = this.videoBgRef?.nativeElement;
    if (videoBg) {
      videoBg.muted = true;
      videoBg.play().catch(err => {
        console.warn('Erro ao iniciar vídeo:', err);
      });
    }
  };

  // Pré-carrega vídeos em memória invisível
  videoFiles.forEach(src => {
    const tempVideo = document.createElement('video');
    tempVideo.src = src;
    tempVideo.preload = 'auto';
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    tempVideo.addEventListener('canplaythrough', () => {
      loadedCount++;
      if (loadedCount === videoFiles.length) {
        onAllVideosLoaded();
      }
    }, { once: true });

    // Força o carregamento
    tempVideo.load();
  });



    if (
      !videoBg ||
      !videoSource ||
      !hamburger ||
      !leftCover ||
      !nav ||
      !overlay ||
      !cursorDot ||
      !cursorTrail ||
      !videoContainer
    ) {
      console.error('Elementos do DOM não encontrados. Verifique seus ViewChilds.');
      return;
    }

    videoBg.muted = true;
    videoBg.play().catch(err => {
      console.warn('Erro autoplay vídeo:', err);
    });

    videoBg.oncanplay = () => {
      this.carDescriptions.first?.nativeElement.classList.add('active');
      videoBg.oncanplay = null;
    };


    // Carrossel principal
    this.carouselItems.forEach((itemRef, index) => {
      const nativeItem = itemRef.nativeElement;
      const listener = this.renderer.listen(nativeItem, 'click', () => {
        if (this.isChangingCar) return;
        this.isChangingCar = true;

        const videoSrc = nativeItem.dataset['video'];
        if (!videoSrc) {
          this.isChangingCar = false;
          return;
        }

        this.carouselItems.forEach(i => i.nativeElement.classList.remove('active'));
        nativeItem.classList.add('active');

        this.carDescriptions.forEach(desc => desc.nativeElement.classList.remove('active'));
        this.carDescriptions.toArray()[index]?.nativeElement.classList.add('active');

        videoBg.classList.add('fading-out');
        videoBg.pause();

        setTimeout(() => {
          videoSource.src = 'assets/' + videoSrc;
          videoBg.load();

          videoBg.oncanplay = () => {
            videoBg.play();
            videoBg.classList.remove('fading-out');
            videoBg.oncanplay = null;
            this.isChangingCar = false;
          };
        }, 600);

        this.onCarChange(index);
      });
      this.listeners.push(listener);
    });


    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const animatedSections = document.querySelectorAll('.animate-on-scroll');
  animatedSections.forEach(section => observer.observe(section));


  


    // Espera o Angular renderizar tudo, e clica no primeiro carro do carrossel
setTimeout(() => {
  const firstCar = this.carouselItems.get(0)?.nativeElement;
  if (firstCar) {
    firstCar.click(); // Clique real no primeiro item do carrossel
    console.log('Clique automático no primeiro carro disparado.');
  } else {
    console.warn('Nenhum carro encontrado para clicar automaticamente.');
  }
}, 200); // pequeno delay para garantir que DOM está pronto

    // Menu hambúrguer
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

    this.listeners.push(
      this.renderer.listen(hamburger, 'click', () => {
        hamburger.classList.contains('open') ? closeMenu() : openMenu();
      })
    );

    this.listeners.push(
      this.renderer.listen(overlay, 'click', () => {
        closeMenu();
      })
    );

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onEsc);
    this.listeners.push(() => document.removeEventListener('keydown', onEsc));

    // Cursor customizado
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

    this.listeners.push(this.renderer.listen(videoContainer, 'mousemove', onMouseMove));
    this.listeners.push(this.renderer.listen(videoContainer, 'mouseleave', onMouseLeave));
    this.listeners.push(this.renderer.listen(nav, 'mousemove', onMouseMove));
    this.listeners.push(this.renderer.listen(nav, 'mouseleave', onMouseLeave));

    const animateTrail = () => {
      this.trailX += (this.mouseX - this.trailX) * 0.15;
      this.trailY += (this.mouseY - this.trailY) * 0.15;
      cursorTrail.style.top = `${this.trailY}px`;
      cursorTrail.style.left = `${this.trailX}px`;
      this.animationFrameId = requestAnimationFrame(animateTrail);
    };
    animateTrail();

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

    this.subscriptions.forEach(s => s.unsubscribe());
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

  toggleUserMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  irParaLogin() {
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

profile: { photoUrl?: string; name?: string; email?: string } | null = null;

irParaMustang() {
  this.router.navigate(['/mustang']);
}

irParaCars () {
  this.router.navigate(['/cars']);
}
irParaSuvs () {
  this.router.navigate(['/suvs']);
}
irParaVans () {
  this.router.navigate(['/vans']);
}
irParaEletric () {
  this.router.navigate(['/eletric']);
}



}


