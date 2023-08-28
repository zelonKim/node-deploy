const { createLogger, format, transports } = require('winston')

const logger = createLogger({ // createLogger함수의 인수로 logger에 대한 설정을 넣어줌.
    level: 'info', // 로그의 심각도 설정 (error > warn > info > verbose > debug > silly)
    format: format.json(), // 로그의 형식 설정(json, label, timestamp, printf, simple, combine)
    transports: [ // 로그의 저장방식 설정(.File: 파일로 저장 / .Console: 콘솔에 출력 )
        new transports.File({ filename: 'combined.log' }), 
        new transports.File({ filename: 'error.log', level: 'error'}) 
    ],
})

if(process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: format.simple() }))
}

module.exports = logger;