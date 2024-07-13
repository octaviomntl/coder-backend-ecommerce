module.exports = {
    getUserName: (user) => user ? user.name : 'Invitado'
};

module.exports = {
    // Helper para mostrar el nombre del usuario si está autenticado
    isLoggedIn: (user, options) => {
        if (user) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    // Otros helpers que necesites
};