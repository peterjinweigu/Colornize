const createGame = (req, res) => {
    let serverManager = req.app.get('server-manager');
    let code = serverManager.createRoom();
    res.send(code);
}

module.exports = {
    createGame
}