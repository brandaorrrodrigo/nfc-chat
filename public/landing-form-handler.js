// ========================================
// HANDLER DE FORMULÁRIO - LANDING PAGE
// ========================================
// Integração com API /api/waitlist

(function() {
  'use strict';

  // Configuração
  const REGISTRATION_URL = '/pt/registro';
  const ENABLE_DIRECT_REGISTRATION = true; // true = redireciona para registro, false = usa waitlist
  const API_URL = '/api/waitlist';
  const SUCCESS_REDIRECT = '/obrigado';
  const ENABLE_REDIRECT = true; // true = redireciona, false = mostra alert

  // Mostrar loading no botão
  function setButtonLoading(button, loading) {
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = '⏳ Processando...';
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
    } else {
      button.textContent = button.dataset.originalText || 'Enviar';
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }

  // Mostrar mensagem de sucesso
  function showSuccess(message) {
    if (ENABLE_REDIRECT) {
      // Redirecionar para página de obrigado
      window.location.href = SUCCESS_REDIRECT;
    } else {
      // Mostrar alert
      alert(`🎉 ${message}`);
    }
  }

  // Mostrar mensagem de erro
  function showError(message) {
    alert(`❌ ${message}`);
  }

  // Validar e-mail
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Enviar para API
  async function submitToAPI(email, source = 'landing_page') {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: source,
          metadata: {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar sua solicitação');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Handler do formulário
  function handleFormSubmit(form, e) {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    // Validação básica
    if (!email) {
      showError('Por favor, digite seu e-mail');
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showError('Por favor, digite um e-mail válido');
      emailInput.focus();
      return;
    }

    // Determinar source baseado na URL e localização do formulário
    let source = 'landing_principal';
    const pathname = window.location.pathname;

    if (pathname.includes('feminino')) {
      source = 'landing_feminino';
    } else if (pathname.includes('emagrecimento')) {
      source = 'landing_emagrecimento';
    } else if (pathname.includes('hipertrofia')) {
      source = 'landing_hipertrofia';
    } else {
      // Se não identificou pelo path, tenta pelo contexto do formulário
      const formParent = form.closest('.hero, .pricing, .email-capture');
      if (formParent) {
        if (formParent.classList.contains('hero')) {
          source = 'landing_hero';
        } else if (formParent.classList.contains('pricing')) {
          source = 'landing_pricing';
        } else {
          source = 'landing_middle';
        }
      }
    }

    // INTEGRAÇÃO DIRETA COM REGISTRO
    if (ENABLE_DIRECT_REGISTRATION) {
      // Capturar UTM parameters se existirem
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source') || '';
      const utm_medium = urlParams.get('utm_medium') || '';
      const utm_campaign = urlParams.get('utm_campaign') || '';

      // Construir URL de registro com parâmetros
      const registrationParams = new URLSearchParams({
        email: email,
        ref: source
      });

      // Adicionar UTMs se existirem
      if (utm_source) registrationParams.append('utm_source', utm_source);
      if (utm_medium) registrationParams.append('utm_medium', utm_medium);
      if (utm_campaign) registrationParams.append('utm_campaign', utm_campaign);

      const registrationUrl = `${REGISTRATION_URL}?${registrationParams.toString()}`;

      // Enviar eventos de tracking antes de redirecionar
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_registration', {
          event_category: 'Registration',
          event_label: source,
        });
      }

      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          source: source,
        });
      }

      // Redirecionar para registro
      window.location.href = registrationUrl;
      return;
    }

    // FLUXO ANTIGO (WAITLIST) - mantido por compatibilidade
    // Mostrar loading
    setButtonLoading(button, true);

    // Enviar para API
    submitToAPI(email, source)
      .then(data => {
        // Sucesso!
        console.log('Lead capturado:', data);

        // Limpar campo
        emailInput.value = '';

        // Feedback
        if (data.already_subscribed) {
          showSuccess('Você já está na lista VIP! Fique atento ao seu e-mail.');
        } else {
          showSuccess(data.message || 'Parabéns! Você entrou para a lista VIP!');
        }

        // Google Analytics / Facebook Pixel (se configurado)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'generate_lead', {
            event_category: 'Waitlist',
            event_label: source,
          });
        }

        if (typeof fbq !== 'undefined') {
          fbq('track', 'Lead', {
            source: source,
          });
        }
      })
      .catch(error => {
        // Erro
        console.error('Erro ao capturar lead:', error);
        showError(error.message || 'Erro ao processar sua solicitação. Tente novamente.');
      })
      .finally(() => {
        // Remover loading
        setButtonLoading(button, false);
      });
  }

  // Inicializar quando DOM estiver pronto
  function init() {
    // Capturar todos os formulários de e-mail
    const forms = document.querySelectorAll('.email-form');

    console.log(`✅ Landing Form Handler inicializado (${forms.length} formulários encontrados)`);

    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        handleFormSubmit(form, e);
      });
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Log para debug
    console.log('📧 Formulários de captura prontos!');
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
