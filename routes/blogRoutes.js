const express = require('express');
const blogController = require('../controller/blogController');
// const authController = require('../controller/authController');

const router = express.Router();

// router.use(authController.protect)

// router.use(authController.restrictTo('admin'))

router
  .route('/')
  .post(blogController.createBlog)
  .get(blogController.getAllBlogs);
//   .delete(
//     userController.getAllUsers);

router
  .route('/:slug')
  //   .delete(
  //     userController.deleteUser)
  .get(blogController.getBlog);

module.exports = router;
