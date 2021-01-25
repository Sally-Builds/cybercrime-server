const Blog = require('../models/blogModel');
const APIFeatures = require('../utils/apiFeature');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//create Blog
exports.createBlog = catchAsync(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newBlog,
    },
  });
});

//get Blog
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    return next(new AppError('No blog found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

//Get all Blog
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

//Update blog
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!blog) {
    return next(new AppError('No blog found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

//
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
  if (!blog) {
    return next(new AppError('No blog found with that slug', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteAllBlog = catchAsync(async (req, res, next) => {});
