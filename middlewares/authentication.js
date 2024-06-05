const authentication = (req, res, next) => {
    console.log('Аутентификация пройдена.. (кастомный middleware заработал!)');
    next();
}

export default authentication;