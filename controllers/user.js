const User = require('../models/user')

exports.follow = async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }}); 
        if(user) {
            await user.addFollowing(parseInt(req.params.id, 10)) // 현재 로그인한 유저와의 관계를 지정함.
            res.send('success')
        } 
        else {
            res.status(404).send('no user')
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}