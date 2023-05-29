const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {

    Post.findAll({
        where: {
            user_id: req.session.user_id
        }, 
        attributes: [ 'id', 'title', 'body', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']

            },
            {
                model: Comment,
                attributes: ['id','comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User, 
                    attributes: ['username']
                }
            },

        ]
    })
    .then(postData => {
        const posts = postData.map(post => post.get({ plain: true}));
        res.render('dashboard', { posts, logged_in: true,
        css: 'dashboard'});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit-post/:id', withAuth, (req, res) => {
    console.log('Received request for post', req.params.id);
    Post.findByPk(req.params.id, {
        attributes: ['id', 'title', 'body','created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id','comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
          
        ]
    })
    .then(postData => {
        if(postData) {
            const post = postData.get({ plain: true});
            console.log(post);
            res.render('edit-post', {
                post, logged_in: true,
                css: 'dashboard'
            });
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});


router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req. session.user_id,
            },
        });

        if(!postData) {
            res.status(404).json({ message: 'No post found with this id!'});
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;