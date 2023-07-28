const index = (req, res) => {
    let code = req.query.g;
    // home page
    if (!code) {
        res.render('index', {title: "Colornize"});
        return;
    }
    let serverManager = req.app.get('server-manager');
    // room dne
    if (!serverManager.roomExists(code)) {
        res.render('error', {title: 'Colornize', error: 'Room not found'});
        return;
    }
    // room full
    if (serverManager.getRoom(code).getSize() == 2) {
        res.render('error', {title: 'Colornize', error: 'Room is full'});
        return;
    }
    // game in progress
    if (serverManager.getRoom(code).inGame) {
        res.render('error', {title: 'Colornize', error: 'Game in progress'});
        return;
    }
    res.render('room', {title: "Colornize", code: code});

}

const notFound = (req, res) => {
    res.status(404).render('error', {title: "404 Not Found", error: "Page not found"});
}

module.exports = {
    index,
    notFound
}