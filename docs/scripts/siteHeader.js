document.addEventListener('DOMContentLoaded', () => {
    const REPO_URL = 'https://github.com/vasyl-chyypesh/fibonacci-test';

    // Internal pages. `match` is the filename that marks the link as active;
    // items without `match` (external / generated) are never highlighted.
    const NAV_ITEMS = [
        { href: 'index.html', label: 'Docs', match: 'index.html' },
        { href: 'fibonacci.html', label: 'Calculator', match: 'fibonacci.html' },
        { href: 'api-docs.html', label: 'API docs', match: 'api-docs.html' },
        { href: 'coverage/index.html', label: 'Coverage', newTab: true }
    ];

    function currentFile() {
        const segment = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        return segment === '' ? 'index.html' : segment;
    }

    function openInNewTab(anchor) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
    }

    const header = document.getElementById('site-header');
    if (!header) {
        return;
    }

    const current = currentFile();

    const brandDot = document.createElement('span');
    brandDot.className = 'brand-dot';

    const brandName = document.createElement('strong');
    brandName.textContent = 'Fibonacci';

    const brandSuffix = document.createElement('span');
    brandSuffix.className = 'brand-suffix';
    brandSuffix.textContent = ' · REST API';

    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = 'index.html';
    brand.append(brandDot, ' ', brandName, brandSuffix);

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Primary');

    NAV_ITEMS.forEach((item) => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;

        if (item.match === current) {
            link.className = 'is-active';
            link.setAttribute('aria-current', 'page');
        }

        if (item.newTab) {
            openInNewTab(link);
        }

        nav.append(link);
    });

    const repoLink = document.createElement('a');
    repoLink.className = 'site-nav-external';
    repoLink.href = REPO_URL;
    repoLink.textContent = 'GitHub';
    openInNewTab(repoLink);

    const themeSlot = document.createElement('div');
    themeSlot.className = 'theme-toggle-row';
    themeSlot.id = 'theme-toggle-slot';

    const actions = document.createElement('div');
    actions.className = 'site-header-actions';
    actions.append(repoLink, themeSlot);

    const inner = document.createElement('div');
    inner.className = 'site-header-inner';
    inner.append(brand, nav, actions);

    header.className = 'site-header';
    header.append(inner);

    globalThis.DocsTheme?.mountThemeToggle('#theme-toggle-slot');
});
