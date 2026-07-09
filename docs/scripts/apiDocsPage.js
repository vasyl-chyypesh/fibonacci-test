document.addEventListener('DOMContentLoaded', () => {
    globalThis.DocsTheme?.mountThemeToggle('#theme-toggle-slot');

    const container = document.getElementById('redoc-container');
    if (!container || typeof Redoc === 'undefined') {
        return;
    }

    const bodyFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const displayFont = '"Space Grotesk", -apple-system, sans-serif';
    const monoFont = '"JetBrains Mono", "SFMono-Regular", Consolas, Menlo, monospace';

    const lightTheme = {
        colors: {
            primary: { main: '#8a6410' },
            text: { primary: '#17191e', secondary: '#59616e' }
        },
        typography: {
            fontFamily: bodyFont,
            fontSize: '15px',
            headings: { fontFamily: displayFont, fontWeight: '600' },
            code: {
                fontFamily: monoFont,
                fontSize: '13px',
                color: '#8a6410',
                backgroundColor: '#f1f3f6'
            }
        },
        sidebar: { backgroundColor: '#f6f7f9', textColor: '#17191e' },
        rightPanel: { backgroundColor: '#15181e', textColor: '#e7eaef' }
    };

    const darkTheme = {
        colors: {
            primary: { main: '#e0ae4a' },
            text: { primary: '#e7eaef', secondary: '#9aa3b2' },
            border: { dark: '#262b34', light: '#262b34' }
        },
        typography: {
            fontFamily: bodyFont,
            fontSize: '15px',
            headings: { fontFamily: displayFont, fontWeight: '600', color: '#e7eaef' },
            code: {
                fontFamily: monoFont,
                fontSize: '13px',
                color: '#e8bd63',
                backgroundColor: '#1b1f27'
            }
        },
        sidebar: { backgroundColor: '#0e1014', textColor: '#e7eaef' },
        rightPanel: { backgroundColor: '#0b0d11', textColor: '#e7eaef' }
    };

    function resolveTheme() {
        const attr = document.documentElement.dataset.theme;
        if (attr === 'light' || attr === 'dark') {
            return attr;
        }
        return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    let currentTheme;

    function render() {
        const nextTheme = resolveTheme();
        if (nextTheme === currentTheme) {
            return;
        }

        currentTheme = nextTheme;
        Redoc.init(
            'openapi.yaml',
            { theme: nextTheme === 'dark' ? darkTheme : lightTheme },
            container
        );
    }

    render();

    new MutationObserver(render).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
});
