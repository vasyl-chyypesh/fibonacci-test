document.addEventListener('DOMContentLoaded', () => {
    const fibonacciForm = document.querySelector('#fibonacci-form');
    const numberInput = document.querySelector('#number-input');
    const submitButton = document.querySelector('#submit-button');
    const statusMessage = document.querySelector('#status-message');
    const errorMessage = document.querySelector('#error-message');
    const resultPanel = document.querySelector('#result-panel');
    const resultTicket = document.querySelector('#result-ticket');
    const resultInput = document.querySelector('#result-input');
    const resultFibonacci = document.querySelector('#result-fibonacci');
    const checkingLoader = document.querySelector('#checking-loader');

    if (
        !fibonacciForm ||
        !numberInput ||
        !submitButton ||
        !statusMessage ||
        !errorMessage ||
        !resultPanel ||
        !resultTicket ||
        !resultInput ||
        !resultFibonacci ||
        !checkingLoader
    ) {
        return;
    }

    const POLL_INTERVAL_MS = 3000;
    const MAX_POLL_ATTEMPTS = 100;

    function setFormBusy(isBusy) {
        submitButton.disabled = isBusy;
        numberInput.disabled = isBusy;
    }

    function clearMessages() {
        statusMessage.textContent = '';
        errorMessage.textContent = '';
    }

    function setCheckingState(isChecking) {
        checkingLoader.hidden = !isChecking;
    }

    function hideResult() {
        resultPanel.hidden = true;
        resultTicket.textContent = '';
        resultInput.textContent = '';
        resultFibonacci.textContent = '';
    }

    function parseJsonSafely(response) {
        return response.text().then((text) => {
            if (!text) {
                return {};
            }

            try {
                return JSON.parse(text);
            } catch {
                return {};
            }
        });
    }

    function sleep(delayMs) {
        return new Promise((resolve) => {
            setTimeout(resolve, delayMs);
        });
    }

    function validateNumber(rawValue) {
        const numericValue = Number(rawValue);
        if (!Number.isInteger(numericValue) || numericValue < 1) {
            return {
                valid: false,
                message: 'Please enter an integer greater than or equal to 1.'
            };
        }

        return { valid: true, value: numericValue };
    }

    async function createTicket(number) {
        const response = await fetch('/input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number })
        });

        const body = await parseJsonSafely(response);
        if (!response.ok) {
            throw new Error(body.message || 'Could not submit number to the API.');
        }

        if (!Number.isInteger(body.ticket)) {
            throw new TypeError('API returned an invalid ticket.');
        }

        return body.ticket;
    }

    async function fetchResult(ticket) {
        const response = await fetch(`/output/${ticket}`);
        const body = await parseJsonSafely(response);
        return { response, body };
    }

    async function pollForResult(ticket) {
        for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt += 1) {
            statusMessage.textContent = `Waiting for result (attempt ${attempt}/${MAX_POLL_ATTEMPTS})...`;
            const { response, body } = await fetchResult(ticket);

            if (response.ok) {
                return body;
            }

            if (response.status === 404) {
                await sleep(POLL_INTERVAL_MS);
                continue;
            }

            throw new Error(body.message || 'Could not fetch Fibonacci result.');
        }

        throw new Error('Timed out while waiting for Fibonacci result. Please try again.');
    }

    function renderResult(result) {
        resultTicket.textContent = String(result.ticket);
        resultInput.textContent = String(result.inputNumber);
        resultFibonacci.textContent = String(result.fibonacci);
        resultPanel.hidden = false;
    }

    fibonacciForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();
        hideResult();

        const validation = validateNumber(numberInput.value);
        if (!validation.valid) {
            errorMessage.textContent = validation.message;
            return;
        }

        setFormBusy(true);
        setCheckingState(false);
        statusMessage.textContent = 'Submitting request...';

        try {
            const ticket = await createTicket(validation.value);
            statusMessage.textContent = `Submitted successfully. Ticket: ${ticket}.`;

            setCheckingState(true);
            const result = await pollForResult(ticket);
            renderResult(result);
            statusMessage.textContent = 'Result received.';
        } catch (error) {
            errorMessage.textContent = error instanceof Error ? error.message : 'Unexpected error occurred.';
        } finally {
            setCheckingState(false);
            setFormBusy(false);
        }
    });
});
