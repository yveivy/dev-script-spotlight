//User facing routes

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ['id', 'title', 'body', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
               
            ],
        })
        
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('homepage', {
            posts, 
            logged_in: req.session.logged_in
        });

    } 
    catch (err) {
        console.log(err);
        res.status(500).json
    }


});

router.get('/post/:id', async (req, res) => {
    try {
    const postData = await Post.findByPk(req.params.id, {
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: Comment,
                attributes: ['id','comment_text','created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                },
            },
           
            
        ]
    });
    if (!postData) {
        res.status(404).json({ message: 'No post found with this id'});
    }

    const post = postData.get({ plain: true});
    
    res.render('post', {
        post: post,
        logged_in: req.session.logged_in,
        css: 'dashboard'

    });

    } catch (err) {
        res.status(500).json(err);
    }
});

//Use with Auth middleware to prevent access to route
router.get('/post', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']},
            include: [{ model: Post}],
        });

        const user = userData.get({ plain: true });

        res.render ('dashboard', {
            ...user,
            logged_in: true
        });
    }catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
// If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;