const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user')

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디
        callbackURL: '/auth/kakao/callback', // 카카오로부터 로그인 인증 결과를 받을 라우터 주소
    }, 
    async(accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile) // profile객체에는 유저 정보가 들어있음.
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao'} // 기존에 카카오를 통해 회원가입한 사용자가 있는지 조회함.
            })
            if(exUser) {
                done(null, exUser);
            } 
            else {
                const newUser = await User.create({ // profile 객체에서 원하는 정보를 꺼내와 회원가입을 진행함.
                    email: profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                })
            done(null, newUser)
            }
        } catch (error) {
            console.error(error)
            done(error)
        }
    }))
}