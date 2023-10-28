export class Http {

    static async request(url, method = 'GET', body = null) {

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        if (body) {
            params.body = JSON.stringify(body);
        }
        const response = await fetch(url, params);
        return await response.json();
    }
}
