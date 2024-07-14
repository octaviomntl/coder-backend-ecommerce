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
    }
};

module.exports = {
    ifCond: function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    }
};

module.exports = {
    eq: (a, b) => {
      return a === b;
    },
    and: (a, b) => {
        return a && b;
      },
};