document.addEventListener('DOMContentLoaded', () => {
    const REPO_URL = 'https://github.com/vasyl-chyypesh/fibonacci-test';

    // Internal pages. `match` is the filename that marks the link as active;
    // items without `match` (external / generated) are never highlighted.
    const NAV_ITEMS = [
        { href: 'index.html', label: 'Docs', match: 'index.html' },
        { href: 'fibonacci.html', label: 'Calculator', match: 'fibonacci.html' },
        { href: 'api-docs.html', label: 'API docs', match: 'api-docs.html' },
        { href: 'coverage/index.html', label: 'Coverage' }
    ];

    function currentFile() {
        const segment = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        return segment === '' ? 'index.html' : segment;
    }

    const header = document.getElementById('site-header');
    if (!header) {
        return;
    }

    const current = currentFile();

    const links = NAV_ITEMS.map((item) => {
        const isActive = item.match === current;
        const attributes = isActive ? ' class="is-active" aria-current="page"' : '';
        return `<a href="${item.href}"${attributes}>${item.label}</a>`;
    }).join('');

    header.className = 'site-header';
    header.innerHTML = `
        <div class="site-header-inner">
            <a class="brand" href="index.html"><span class="brand-dot"></span> <strong>Fibonacci</strong><span class="brand-suffix"> · REST API</span></a>
            <nav class="site-nav" aria-label="Primary">${links}</nav>
            <div class="site-header-actions">
                <a class="site-nav-external" href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>
                <div class="theme-toggle-row" id="theme-toggle-slot"></div>
            </div>
        </div>
    `;

    globalThis.DocsTheme?.mountThemeToggle('#theme-toggle-slot');
});
