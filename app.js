const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const passport = require('passport')
const helmet = require('helmet')
const hpp = require('hpp')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)

dotenv.config()

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}: ${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
})
redisClient.connect().catch(console.error)


const pageRouter = require('./routes/page')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

const { sequelize } = require('./models')
const passportConfig = require('./passport')
const logger = require('./logger')

const app = express()

passportConfig()
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true
})

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터 베이스 연결 성공')
    })
    .catch((err) => {
        console.error(err)
    })

if(process.env.NODE_ENV === 'production') { // process.env.NODE_ENV 환경변수를 통해 개발환경인지 배포환경인지 판단할 수 있음. (.env 파일에 넣을 수 없음.)
    app.use(morgan('combined')) // 배포 환경
    app.use(
        helmet({ // 보안 규칙에서 원하는 옵션을 설정함.
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        })
    )
    app.use(hpp())
} 
else {
    app.use(morgan('dev')) // 개발 환경
}


app.use(express.static(path.join(__dirname, 'public')))

app.use('/img', express.static(path.join(__dirname, 'uploads'))) 
// static미들웨어로 업로드한 이미지를 제공할 라우터('/img')를 'uploads'폴더와 연결함.
// uploads폴더 내 사진들이 '/img'경로로 제공됨.

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser(process.env.COOKIE_SECRET))

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    store: new RedisStore({ client: redisClient })
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true; // https 적용을 위해 노드 서버 앞에 다른 서버를 뒀을 때 proxy를 true로 지정함.
    sessionOption.cookie.secure = true; // https를 적용할 때만 cookie.secure를 true로 지정함.
}



app.use(session(sessionOption))

app.use(passport.initialize()) // req객체에 passport설정을 심음.
app.use(passport.session()) // req.session객체에 passport정보를 저장함.


app.use('/', pageRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)



app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`)
    error.status = 404;
    // 로거 객체.심각도 메서드('메시지'): 해당 심각도가 적용된 로그가 기록됨.
    logger.info('hello')
    logger.error(error.message)
    next(error)
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {}
    res.status(err.status || 500)
    res.render('error')
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})

