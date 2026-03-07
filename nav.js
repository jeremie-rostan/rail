(function () {
  const nav = document.querySelector('#main-nav');
  if (!nav) return;

  const links = [
    ['./index.html', 'Home'],
    ['./incidents.html', 'Incident Categories'],
    ['./response.html', 'Prevention & Response'],
    ['./eu-ai-act.html', 'EU AI Act'],
    ['./eu-ai-act-summary.html', 'EU AI Act Summary'],
    ['./data-protection-gdpr.html', 'AI Data Protection & GDPR'],
    ['./curriculum.html', 'Curriculum Map'],
    ['./infographics.html', 'Infographics'],
    ['./action-plan.html', 'Action Plan']
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';
  nav.innerHTML = links
    .map(([href, label]) => {
      const page = href.replace('./', '');
      const active = page === current ? ' aria-current="page"' : '';
      return `<a href="${href}"${active}>${label}</a>`;
    })
    .join('');

  const menuToggle = document.querySelector('#menu-toggle');
  menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));
})();
