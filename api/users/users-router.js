const express = require('express');
const userModel = require("./users-model")
const postsModel = require("../posts/posts-model")
const mw = require("../middleware/middleware")

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get('/', async (req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  try {
    let allUsers = await userModel.get();
    res.json(allUsers)
  } catch (error) {
    res.status(500).json({message:"Hata oluştu"})
  }
});

router.get('/:id', mw.validateUserId, (req, res, next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  try {
    res.json(req.currentUser)
  } catch (error) {
    next(error)
  }
});

router.post('/', mw.validateUser, async (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  try {
    const insertedUser = await userModel.insert({name:req.body.name})
    res.status(201).json(insertedUser)
  } catch (error) {
    next(error)
  }
});

router.put('/:id',mw.validateUserId,mw.validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    const updatedUser = await userModel.update(req.params.id,{name:req.body.name})
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
});

router.delete('/:id',mw.validateUserId, async (req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    await userModel.remove(req.params.id)
    res.json(req.currentUser)
  } catch (error) {
    next(error)
  }
});

router.get('/:id/posts',mw.validateUserId, async (req, res, next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    const userPosts = await userModel.getUserPosts(req.params.id);
    res.json(userPosts);
  } catch (error) {
   next(error) 
  }
});

router.post('/:id/posts',mw.validateUserId, mw.validatePost, async (req, res) => {
  // YENİ OLUŞTURULAN Post NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    let insertedPost = await postsModel.insert({user_id:req.params.id,text:req.body.text})
    res.status(201).json(insertedPost)
  } catch (error) {
    next(error)
  }
});

// routerı dışa aktarmayı unutmayın
module.exports = router;
