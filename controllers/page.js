const { User, Post, Hashtag } = require('../models')

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
  };
  
  exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
  };
  


  exports.renderMain = async (req, res, next) => {
    try {
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ['id', 'nick'] // 게시글 작성자의 아이디와 닉네임을 JOIN해서 제공함.
        },
        order: [['createdAt', 'DESC']], // 게시글의 순서를 최신순으로 정렬함.
      })

      res.render('main', {
        title: 'NodeBird',
        twits: posts, // 데이터 베이스에서 조회한 게시글을 twits에 넣어 렌더링함.
      })
    } 
    catch (err) {
        console.err(err)
        next(err)
      }
    }



    
exports.renderHashtag = async(req, res, next) => {
  const query = req.query.hashtag;

  if(!query) {
    return res.redirect('/')
  }

  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } })
    
    let posts = []

    if(hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] }) 
    } // 해시태그가 있을 경우, getPosts 메서드로 모든 게시글을 조회함.  // include를 통해 작성자 정보를 합침.

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts, 
    }) 
  } 
  catch (error) {
    console.error(error);
    return next(error)
  }
}
