// ========================================
// LANDING PAGE ENHANCEMENTS v2.0
// ========================================
// Todos os recursos avançados de conversão

(function() {
  'use strict';

  // ========================================
  // 1. ANALYTICS TRACKING
  // ========================================

  const Analytics = {
    init() {
      // Google Analytics 4
      this.initGA4();

      // Facebook Pixel
      this.initFacebookPixel();

      // Microsoft Clarity
      this.initClarity();

      // Track events
      this.trackScrollDepth();
      this.trackTimeOnPage();
      this.trackButtonClicks();
    },

    initGA4() {
      // Verificar se GA4 já está carregado
      if (typeof gtag === 'undefined') {
        console.log('⚠️ Google Analytics não configurado. Adicione o script GA4 no <head>');
        return;
      }

      console.log('✅ Google Analytics 4 inicializado');

      // Track page view
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    },

    initFacebookPixel() {
      if (typeof fbq === 'undefined') {
        console.log('⚠️ Facebook Pixel não configurado. Adicione o script no <head>');
        return;
      }

      console.log('✅ Facebook Pixel inicializado');

      // Track PageView
      fbq('track', 'PageView');
    },

    initClarity() {
      if (typeof clarity === 'undefined') {
        console.log('⚠️ Microsoft Clarity não configurado. Adicione o script no <head>');
        return;
      }

      console.log('✅ Microsoft Clarity inicializado');
    },

    trackScrollDepth() {
      let maxScroll = 0;
      const milestones = [25, 50, 75, 100];
      const tracked = new Set();

      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
        }

        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !tracked.has(milestone)) {
            tracked.add(milestone);

            if (typeof gtag !== 'undefined') {
              gtag('event', 'scroll_depth', {
                percent: milestone,
                event_category: 'Engagement'
              });
            }
          }
        });
      });
    },

    trackTimeOnPage() {
      const startTime = Date.now();
      const milestones = [30, 60, 120, 300]; // segundos
      const tracked = new Set();

      setInterval(() => {
        const secondsOnPage = Math.floor((Date.now() - startTime) / 1000);

        milestones.forEach(milestone => {
          if (secondsOnPage >= milestone && !tracked.has(milestone)) {
            tracked.add(milestone);

            if (typeof gtag !== 'undefined') {
              gtag('event', 'time_on_page', {
                seconds: milestone,
                event_category: 'Engagement'
              });
            }
          }
        });
      }, 5000);
    },

    trackButtonClicks() {
      document.querySelectorAll('.btn, button, a[href]').forEach(element => {
        element.addEventListener('click', (e) => {
          const text = element.textContent.trim();
          const href = element.href || '';

          if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
              event_category: 'Button',
              event_label: text,
              value: href
            });
          }
        });
      });
    }
  };

  // ========================================
  // 2. EXIT INTENT POPUP
  // ========================================

  const ExitIntent = {
    shown: false,

    init() {
      // Detectar quando cursor sai da página (desktop)
      document.addEventListener('mouseout', (e) => {
        if (!e.toElement && !e.relatedTarget && !this.shown) {
          this.show();
        }
      });

      // Detectar back button (mobile)
      window.addEventListener('popstate', () => {
        if (!this.shown) {
          this.show();
          history.pushState(null, '', window.location.href);
        }
      });
    },

    show() {
      this.shown = true;

      // Criar overlay
      const overlay = document.createElement('div');
      overlay.className = 'exit-popup-overlay';
      overlay.innerHTML = `
        <div class="exit-popup">
          <button class="exit-popup-close">×</button>

          <div class="exit-popup-content">
            <div class="exit-popup-icon">🎁</div>
            <h2>Espere! Não Vá Embora...</h2>
            <p class="exit-popup-subtitle">
              Você está a <strong>1 clique</strong> de transformar seu corpo com ciência de verdade
            </p>

            <div class="exit-popup-offer">
              <div class="exit-popup-badge">🔥 OFERTA EXCLUSIVA</div>
              <h3>Entre agora na Lista VIP e ganhe:</h3>
              <ul class="exit-popup-benefits">
                <li>✅ <strong>50% OFF</strong> no lançamento (apenas primeiros 500)</li>
                <li>✅ <strong>E-book grátis:</strong> "10 Protocolos Científicos Para Emagrecer"</li>
                <li>✅ <strong>Acesso antecipado</strong> ao app (antes de todos)</li>
                <li>✅ <strong>Grupo VIP</strong> no WhatsApp com suporte direto</li>
              </ul>
            </div>

            <div class="exit-popup-urgency">
              ⏰ Apenas <strong id="exit-popup-spots">47 vagas</strong> restantes nesta condição
            </div>

            <form class="email-form exit-popup-form">
              <input
                type="email"
                name="email"
                placeholder="Digite seu melhor e-mail"
                required
                class="exit-popup-input"
              >
              <button type="submit" class="exit-popup-btn">
                🚀 Quero Meu Desconto VIP
              </button>
            </form>

            <p class="exit-popup-guarantee">
              🔒 Seus dados estão seguros. Sem spam, apenas conteúdo de valor.
            </p>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      // Animação de entrada
      setTimeout(() => overlay.classList.add('active'), 10);

      // Track evento
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent_shown', {
          event_category: 'Popup'
        });
      }

      // Fechar popup
      const closeBtn = overlay.querySelector('.exit-popup-close');
      closeBtn.addEventListener('click', () => this.hide(overlay));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.hide(overlay);
        }
      });

      // Countdown de vagas
      this.animateSpots();
    },

    hide(overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 300);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent_closed', {
          event_category: 'Popup'
        });
      }
    },

    animateSpots() {
      const spotsEl = document.getElementById('exit-popup-spots');
      if (!spotsEl) return;

      let spots = 47;
      setInterval(() => {
        if (Math.random() > 0.7 && spots > 20) {
          spots--;
          spotsEl.textContent = spots;
          spotsEl.classList.add('pulse');
          setTimeout(() => spotsEl.classList.remove('pulse'), 500);
        }
      }, 8000);
    }
  };

  // ========================================
  // 3. LIVE SOCIAL PROOF NOTIFICATIONS
  // ========================================

  const SocialProof = {
    notifications: [
      { name: 'Maria Silva', city: 'São Paulo', time: '2 minutos atrás' },
      { name: 'João Santos', city: 'Rio de Janeiro', time: '5 minutos atrás' },
      { name: 'Ana Costa', city: 'Belo Horizonte', time: '8 minutos atrás' },
      { name: 'Carlos Lima', city: 'Brasília', time: '12 minutos atrás' },
      { name: 'Fernanda Souza', city: 'Curitiba', time: '15 minutos atrás' },
      { name: 'Ricardo Alves', city: 'Porto Alegre', time: '18 minutos atrás' },
      { name: 'Juliana Rocha', city: 'Recife', time: '22 minutos atrás' },
      { name: 'Paulo Martins', city: 'Salvador', time: '25 minutos atrás' },
      { name: 'Camila Ferreira', city: 'Fortaleza', time: '30 minutos atrás' },
      { name: 'Lucas Oliveira', city: 'Manaus', time: '35 minutos atrás' },
    ],
    currentIndex: 0,
    container: null,

    init() {
      // Criar container
      this.container = document.createElement('div');
      this.container.className = 'social-proof-notification';
      this.container.innerHTML = `
        <div class="social-proof-content">
          <div class="social-proof-icon">🔥</div>
          <div class="social-proof-text">
            <strong class="social-proof-name"></strong>
            <span class="social-proof-action">entrou na Lista VIP</span>
            <div class="social-proof-meta">
              <span class="social-proof-city"></span> •
              <span class="social-proof-time"></span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.container);

      // Mostrar primeira notificação após 5 segundos
      setTimeout(() => this.showNext(), 5000);
    },

    showNext() {
      const notification = this.notifications[this.currentIndex];

      // Atualizar conteúdo
      this.container.querySelector('.social-proof-name').textContent = notification.name;
      this.container.querySelector('.social-proof-city').textContent = notification.city;
      this.container.querySelector('.social-proof-time').textContent = notification.time;

      // Mostrar
      this.container.classList.add('active');

      // Track
      if (typeof gtag !== 'undefined') {
        gtag('event', 'social_proof_shown', {
          event_category: 'Notification',
          event_label: notification.name
        });
      }

      // Esconder após 5 segundos
      setTimeout(() => {
        this.container.classList.remove('active');
      }, 5000);

      // Próxima notificação em 15-25 segundos (aleatório)
      this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
      const nextDelay = 15000 + Math.random() * 10000;
      setTimeout(() => this.showNext(), nextDelay);
    }
  };

  // ========================================
  // 4. COUNTDOWN TIMER
  // ========================================

  const CountdownTimer = {
    endTime: null,

    init() {
      // Definir fim do timer (24 horas a partir de agora)
      // Salvar no localStorage para persistir entre sessões
      const saved = localStorage.getItem('nutrifitcoach_timer_end');

      if (saved) {
        this.endTime = new Date(saved);
      } else {
        this.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        localStorage.setItem('nutrifitcoach_timer_end', this.endTime.toISOString());
      }

      // Criar elementos de countdown
      document.querySelectorAll('.countdown-placeholder').forEach(el => {
        el.innerHTML = `
          <div class="countdown-timer">
            <div class="countdown-label">⏰ Oferta VIP expira em:</div>
            <div class="countdown-digits">
              <div class="countdown-digit">
                <span class="countdown-value" data-unit="hours">00</span>
                <span class="countdown-unit">Horas</span>
              </div>
              <div class="countdown-separator">:</div>
              <div class="countdown-digit">
                <span class="countdown-value" data-unit="minutes">00</span>
                <span class="countdown-unit">Minutos</span>
              </div>
              <div class="countdown-separator">:</div>
              <div class="countdown-digit">
                <span class="countdown-value" data-unit="seconds">00</span>
                <span class="countdown-unit">Segundos</span>
              </div>
            </div>
          </div>
        `;
      });

      // Atualizar a cada segundo
      this.update();
      setInterval(() => this.update(), 1000);
    },

    update() {
      const now = new Date();
      const diff = this.endTime - now;

      if (diff <= 0) {
        // Timer expirado - reiniciar para +24h
        this.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        localStorage.setItem('nutrifitcoach_timer_end', this.endTime.toISOString());
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Atualizar todos os countdowns
      document.querySelectorAll('[data-unit="hours"]').forEach(el => {
        el.textContent = String(hours).padStart(2, '0');
      });
      document.querySelectorAll('[data-unit="minutes"]').forEach(el => {
        el.textContent = String(minutes).padStart(2, '0');
      });
      document.querySelectorAll('[data-unit="seconds"]').forEach(el => {
        el.textContent = String(seconds).padStart(2, '0');
      });

      // Adicionar urgência visual quando < 1h
      if (hours === 0) {
        document.querySelectorAll('.countdown-timer').forEach(el => {
          el.classList.add('urgent');
        });
      }
    }
  };

  // ========================================
  // 5. WHATSAPP FLOATING BUTTON
  // ========================================

  const WhatsAppButton = {
    init() {
      const phone = '5511999999999'; // ⚠️ SUBSTITUIR pelo número real
      const message = encodeURIComponent('Olá! Vim do site do NutriFitCoach e gostaria de saber mais sobre a Lista VIP.');

      const button = document.createElement('a');
      button.href = `https://wa.me/${phone}?text=${message}`;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.className = 'whatsapp-float';
      button.innerHTML = `
        <svg viewBox="0 0 32 32" width="32" height="32">
          <path fill="currentColor" d="M16 0C7.164 0 0 7.164 0 16c0 2.827.743 5.48 2.046 7.787L.088 31.912l8.39-2.202A15.916 15.916 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm8.437 22.786c-.356.998-1.774 1.838-2.88 2.078-.747.162-1.724.294-5.011-.938-4.209-1.574-6.93-5.862-7.143-6.131-.203-.27-1.676-2.23-1.676-4.255s1.062-3.02 1.438-3.432c.376-.412.82-.515 1.094-.515.27 0 .542.004.779.014.25.012.586-.095.918.7.337.81 1.15 2.806 1.252 3.01.102.203.17.44.034.71-.135.27-.203.44-.405.676-.203.237-.425.53-.608.71-.202.202-.413.422-.178.826.236.405 1.048 1.728 2.247 2.8 1.545 1.38 2.848 1.81 3.252 2.01.405.203.64.17.876-.102.237-.27 1.014-1.184 1.285-1.59.27-.405.542-.337.914-.202.376.135 2.385 1.124 2.793 1.33.406.203.676.304.776.473.102.17.102.976-.254 1.974z"/>
        </svg>
        <span class="whatsapp-text">Dúvidas?</span>
      `;

      document.body.appendChild(button);

      // Track clicks
      button.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'whatsapp_click', {
            event_category: 'Contact'
          });
        }
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Contact');
        }
      });
    }
  };

  // ========================================
  // 6. LAZY LOADING DE IMAGENS
  // ========================================

  const LazyLoad = {
    init() {
      const images = document.querySelectorAll('img[data-src]');

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback para navegadores antigos
        images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  };

  // ========================================
  // 7. SCROLL PROGRESS BAR
  // ========================================

  const ScrollProgress = {
    init() {
      const bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      document.body.appendChild(bar);

      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = `${scrollPercent}%`;
      });
    }
  };

  // ========================================
  // INICIALIZAÇÃO
  // ========================================

  function init() {
    console.log('🚀 Landing Page Enhancements v2.0 inicializando...');

    // Analytics (sempre primeiro)
    Analytics.init();

    // Exit intent (após 10 segundos na página)
    setTimeout(() => ExitIntent.init(), 10000);

    // Social proof (após 3 segundos)
    setTimeout(() => SocialProof.init(), 3000);

    // Countdown timer
    CountdownTimer.init();

    // WhatsApp button
    WhatsAppButton.init();

    // Lazy loading
    LazyLoad.init();

    // Scroll progress
    ScrollProgress.init();

    console.log('✅ Todos os enhancements carregados com sucesso!');
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
