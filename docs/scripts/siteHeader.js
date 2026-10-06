document.addEventListener('DOMContentLoaded', () => {
    const REPO_URL = 'https://github.com/vasyl-chyypesh/fibonacci-test';

    // Site pages, relative to the docs root. Items with `newTab` (generated
    // reports outside this site's shell) are never highlighted.
    const NAV_ITEMS = [
        { href: 'index.html', label: 'Docs' },
        { href: 'fibonacci.html', label: 'Calculator' },
        { href: 'api-docs.html', label: 'API docs' },
        { href: 'coverage/index.html', label: 'Coverage', newTab: true },
        { href: 'benchmarks/report.html', label: 'Benchmarks' }
    ];

    // Treats a directory URL ("/docs/") as its index.html.
    function normalizePath(pathname) {
        return pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    }

    function openInNewTab(anchor) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
    }

    const header = document.getElementById('site-header');
    if (!header) {
        return;
    }

    // Pages below the docs root set data-root (e.g. "../") so links resolve from there.
    const siteRoot = header.dataset.root ?? '';
    const current = normalizePath(location.pathname);

    const brandDot = document.createElement('span');
    brandDot.className = 'brand-dot';

    const brandName = document.createElement('strong');
    brandName.textContent = 'Fibonacci';

    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = `${siteRoot}index.html`;
    brand.append(brandDot, ' ', brandName);

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Primary');

    NAV_ITEMS.forEach((item) => {
        const link = document.createElement('a');
        link.href = siteRoot + item.href;
        link.textContent = item.label;

        if (!item.newTab && normalizePath(link.pathname) === current) {
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
