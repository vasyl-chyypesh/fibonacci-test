document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('pre[data-copy], #result-fibonacci');

    async function writeToClipboard(text) {
        try {
            if (navigator.clipboard && globalThis.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch {
            // fall through to the legacy path below
        }

        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(textarea);
            return ok;
        } catch {
            return false;
        }
    }

    blocks.forEach((pre) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-chip';
        button.setAttribute('aria-label', 'Copy to clipboard');
        button.innerHTML = `
            <svg class="copy-icon copy-icon-clipboard" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="copy-icon copy-icon-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>`;
        wrapper.appendChild(button);

        let resetTimer;

        button.addEventListener('click', async () => {
            const codeElement = pre.querySelector('code');
            const text = (codeElement ? codeElement.textContent : pre.textContent).trim();
            if (!text) {
                return;
            }

            const copied = await writeToClipboard(text);
            button.classList.toggle('is-copied', copied);
            button.setAttribute('aria-label', copied ? 'Copied' : 'Copy failed, press Ctrl or Cmd + C');

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                button.classList.remove('is-copied');
                button.setAttribute('aria-label', 'Copy to clipboard');
            }, 1500);
        });
    });
});
