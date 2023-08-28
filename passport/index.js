const User = require('../models/user')
const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')


module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id) // 유저 정보 객체에서 아이디만 추려 세션에 저장함.
    })

    passport.deserializeUser((id, done) => { // 라우터가 실행되기 전에 deserializeUser가 먼저 실행됨.
        User.findOne({ 
            where: { id }, // 세션에 저장된 아이디를 통해 유저 데이터를 가져옴.
            include: [{ // req.user에도 팔로워와 팔로잉 목록을 저장함.
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }],
        }) 
            .then(user => done(null, user)) // 조회한 정보를 req.user 에 저장함.
            .catch(err => done(err))
    })

    local()
    kakao()
}

