const { Post, Hashtag } = require('../models')

exports.afterUploadImage = (req, res) => {
    console.log(req.file)
    res.json({ url: `/img/${req.file.filename}`})
}



exports.uploadPost = async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        })

        const hashtags = req.body.content.match(/#[^\s#]*/g) // 게시글 내용에서 해시태그를 정규표현식으로 추출해냄.

        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({ // 데이터 베이스에 해시태그가 존재하면 찾아오고, 존재하지 않으면 생성한 후 찾아옴.
                         where: { title: tag.slice(1).toLowerCase() }, // 해시태그에서 #을 떼고, 모두 소문자로 바꿈.
                    })
                }),
            )
            await post.addHashtags(result.map(r => r[0])) // result값인 [해시태그 모델, 생성 여부]에서 해시태그 모델만 추출해냄.
        } // 해시태그 모델들을 addHashtags 메서드로 게시글과 연결함.
        res.redirect('/')
    }
    catch(error) {
        console.error(error)
        next(error)
    }
}