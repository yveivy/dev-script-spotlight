const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('.postRoutes');
const commentRoutes = require('./comment-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
routers.use('/comments', commentRoutes);

module.exports = router;

