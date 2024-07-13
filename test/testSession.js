app.get('/test-session', (req, res) => {
    if (req.user) {
        res.send(`Usuario autenticado: ${req.user.name}`);
    } else {
        res.send('No hay usuario autenticado');
    }
});