const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { afterUploadImage, uploadPost } = require('../controllers/post')
const { isLoggedIn } = require('../middlewares')

const router = express.Router()

try {
    fs.readdirSync('uploads') // readdirSync() Reads the contents of the directory.
} 
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다')
    fs.mkdirSync('uploads') // mkdirSync() create a directory.
}


const upload = multer({ // The multer returns middleware that process files uploaded in multipart/form-data format.
    storage: multer.diskStorage({ // diskStorage() returns a StorageEngine implementation configured to store files on the local file system.
        destination(req, file, cb) { // destination()`s callback function takes a string or function that determines the destination path for uploaded files.
            cb(null, 'uploads/') // 이미지는 서버 디스크인 uploads 폴더에 저장함.

        },
        filename(req, file, cb) { // filename()`s callback function takes a function that determines the name of the uploaded file
            const ext = path.extname(file.originalname) // extname() returns the extension of the path,
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext) // basename() returns the last portion of a path.  / optionally, an extension to remove from the result.
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
})
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage) 
// sinigle() returns middleware that processes a single file associated with the given form field.
// 이미지를 업로드 받은 뒤, 이미지의 저장 경로를 클라이언트에게 응답함.



const upload2 = multer()
router.post('/', isLoggedIn, upload2.none(), uploadPost) // none() returns middleware that accepts only non-file multipart form fields.
// 게시글을 업로드 함.
// 이미지 경로만 저장함.
// 데이터 형식은 멀티파트 이지만, 이미지가 들어있지 않으므로 none 메서드를 사용함.

module.exports = router;