const express = require('express')
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares')
const { join, login, logout } = require('../controllers/auth')

const router = express.Router()

router.post('/join', isNotLoggedIn, join)

router.post('/login', isNotLoggedIn, login)

router.get('/logout', isLoggedIn, logout)

router.get('/kakao', passport.authenticate('kakao')) // 카카오 로그인 전략을 시작함.

router.get('/kakao/callback', passport.authenticate('kakao', { // 카카오 로그인 인증 결과를 받음.
    failureRedirect: `/?loginError=카카오 로그인 실패`, // 로그인 실패 시 이동할 경로를 지정함.
}), (req, res) => {
    res.redirect('/')
})

module.exports = router;