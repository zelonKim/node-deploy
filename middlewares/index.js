exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 로그인 상태이면 req.isAuthenticated()는 true임.
        next()
    } else {
        res.status(403).send('you are not logged in')
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // 로그아웃 상태이면 req.isAuthenticated()는 false임.
        next()
    } else {
        const message = encodeURIComponent('you are logged in')
        res.redirect(`/?error=${message}`)
    }
} 

