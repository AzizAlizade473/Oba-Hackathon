const API_BASE = 'http://16.171.0.209:3000/api/v1';

async function testApi() {
  try {
    // 1. Login to get token
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+994551234567', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token || loginData.access_token;
    console.log('Got Token:', !!token);

    if (!token) {
      console.log('Login failed:', loginData);
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Get Top Products to find an ID
    const topRes = await fetch(`${API_BASE}/products/top`, { headers });
    const topData = await topRes.json();
    const products = Array.isArray(topData) ? topData : topData.data;
    const firstProduct = products[0];
    console.log('--- First Top Product ---');
    console.log(JSON.stringify(firstProduct, null, 2));
  } catch (e) {
    console.error('Test script error:', e);
  }
}
testApi();
