class ApiConfigService {
    constructor(baseUrl, apiKey) {
        this.urlBase = baseUrl;
        this.apiKey = apiKey;
    }

    getHeaders() {
        return {
            'apiKey': this.apiKey,
            'Authorization': 'Bearer ' + this.apiKey,
            'Content-Type': 'application/json'
        };
    }

    async handleError(response) {
        const error = await response.json();
        console.error('Error', error);
        throw new Error(error.message || 'An error occurred');
    }

    async get(path, params = {}) {
        const url = new URL(`${this.urlBase}/rest/v1/${path}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }

    async post(path, data) {
        const url = `${this.urlBase}/rest/v1/${path}`;
        console.log('URL de la solicitud:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }

    async patch(path, data, params = {}) {
        const url = new URL(`${this.urlBase}/rest/v1/${path}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }

    async delete(path, params = {}) {
        const url = new URL(`${this.urlBase}/rest/v1/${path}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }

    async editField(path, fieldName, value, params = {}) {
        const data = { [fieldName]: value };
        return await this.patch(path, data, params);
    }

    async signUpUser(correo, password) {
        const response = await fetch(`${this.urlBase}/rest/v1/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                email: correo,
                password: password
            })
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }
}

// Ejemplo de uso:
const apiConfigService = new ApiConfigService('https://ndmnmgusnnmndqwigiyp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbW5tZ3Vzbm5tbmRxd2lnaXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczOTExNzEsImV4cCI6MjA0Mjk2NzE3MX0.ESF_jBHTyESdtYoCWIHv9uo-hX4caAtGiCbstBf3ITc');
