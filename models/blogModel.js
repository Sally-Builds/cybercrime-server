const slugify = require('slugify');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    unique: true,
  },
  author: {
    type: String,
    default: 'Anonymous Writer',
  },
  previewText: {
    type: String,
    required: [true, 'Please you have to provide a preview text or abstract'],
  },
  blogPost: {
    type: String,
    required: [true, 'Please you must provide the blog pose'],
  },
  tags: {
    type: [String],
    required: [true, 'Please provide tags for SEO'],
  },
  images: [String],
  imageCover: {
    type: String,
    required: [true, 'Please Provide an cover image for your Post'],
  },
  slug: String,
});

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title);
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
