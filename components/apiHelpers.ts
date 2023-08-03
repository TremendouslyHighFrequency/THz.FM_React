const DEFAULT_EXPLORER_API_ADDRESS = "https://api.ergoplatform.com/";
const explorerApiV1 = DEFAULT_EXPLORER_API_ADDRESS + 'api/v1';

export async function getRequestV1(url: string) {
    const res = await get(explorerApiV1 + url);
    const data = await res.json();
    console.log("data:", data);
    return data;
}

export async function getExplorerBlockHeaders() {
    let res: any = [];
    let headers = [];
    try {
        res = await getRequestV1(`/blocks/headers`);
        headers = res.items.slice(0, 10);
    } catch (e) {
        console.log("error", e);
    }
    return headers;
}

async function get(url: string, apiKey = '') {
    return await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
    });
}

async function post(url: string, body = {}, apiKey = '') {
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
        body: JSON.stringify(body),
    });
}
