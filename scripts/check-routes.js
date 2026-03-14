async function checkRoutes() {
    const routes = [
        '/',
        '/auth/signin',
        '/auth/verify-email',
        '/catalogue',
        '/admin'
    ];

    for (const route of routes) {
        try {
            const res = await fetch(`http://localhost:3000${route}`, { method: 'HEAD' });
            console.log(`${route}: ${res.status} ${res.statusText}`);
        } catch (err) {
            console.log(`${route}: FAILED TO FETCH (${err.message})`);
        }
    }
}

checkRoutes();
