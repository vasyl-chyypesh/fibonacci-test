(function bootstrapDocsTheme(globalObject) {
    const THEME_STORAGE_KEY = 'theme';
    const rootElement = document.documentElement;

    function getPreferredTheme() {
        return globalObject.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(buttonElement, theme) {
        rootElement.dataset.theme = theme;

        const isDark = theme === 'dark';
        const nextThemeLabel = isDark ? 'Switch to Light mode' : 'Switch to Dark mode';
        buttonElement.dataset.nextTheme = isDark ? 'light' : 'dark';
        buttonElement.setAttribute('title', nextThemeLabel);
        buttonElement.setAttribute('aria-label', nextThemeLabel);
        buttonElement.setAttribute('aria-pressed', String(isDark));
    }

    function initializeTheme(buttonElement) {
        const savedTheme = globalObject.localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(buttonElement, savedTheme);
            return;
        }

        const preferredTheme = getPreferredTheme();
        setTheme(buttonElement, preferredTheme);
        delete rootElement.dataset.theme;
    }

    function createThemeToggleButton() {
        const buttonElement = document.createElement('button');
        buttonElement.id = 'theme-toggle';
        buttonElement.className = 'theme-toggle';
        buttonElement.type = 'button';
        buttonElement.setAttribute('aria-pressed', 'false');
        buttonElement.setAttribute('aria-label', 'Switch to Dark mode');
        buttonElement.setAttribute('title', 'Switch to Dark mode');
        buttonElement.innerHTML = `
            <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="12" y1="1.5" x2="12" y2="4.5"></line>
                <line x1="12" y1="19.5" x2="12" y2="22.5"></line>
                <line x1="1.5" y1="12" x2="4.5" y2="12"></line>
                <line x1="19.5" y1="12" x2="22.5" y2="12"></line>
                <line x1="4.2" y1="4.2" x2="6.4" y2="6.4"></line>
                <line x1="17.6" y1="17.6" x2="19.8" y2="19.8"></line>
                <line x1="4.2" y1="19.8" x2="6.4" y2="17.6"></line>
                <line x1="17.6" y1="6.4" x2="19.8" y2="4.2"></line>
            </svg>
            <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M14.5 3a8.5 8.5 0 1 0 6.5 14a8 8 0 0 1 -6.5 -14z"></path>
            </svg>
        `;

        initializeTheme(buttonElement);
        buttonElement.addEventListener('click', () => {
            const activeTheme = rootElement.dataset.theme || getPreferredTheme();
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            setTheme(buttonElement, nextTheme);
            globalObject.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        });

        return buttonElement;
    }

    function mountThemeToggle(target) {
        const containerElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!containerElement) {
            return;
        }

        containerElement.replaceChildren(createThemeToggleButton());
    }

    globalObject.DocsTheme = {
        mountThemeToggle
    };
})(globalThis);
