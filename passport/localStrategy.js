const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () => { // LocalStrategy({전략에 관한 설정}, 실제 전략을 담은 async 함수)
    passport.use(new LocalStrategy({ 
        usernameField: 'email', // async함수의 첫번째 매개변수가 됨. 
        passwordField: 'password', // async함수의 두번째 매개변수가 됨.
        passReqToCallback: false,
    }, 
    async(email, password, done) => { // done 함수는 passport.authenticate의 콜백 함수임.
        try {
            const exUser = await User.findOne({ where: {email} })

            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password)
                
                if(result) {
                    done(null, exUser)
                } 
                else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'})
                }
            }
             else {
                done(null, false, {message: "가입되지 않은 회원입니다."})
            }
        } 
        catch (error) {
            console.error(error)
            done(error)
        }
    }))
}