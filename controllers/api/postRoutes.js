const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id','title','body','created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text','post_id','user_id','created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id','title','body','created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            body: req.body.body
        },
        {
            where: {
                id: req.params.id
            }
        }

    )
    .then(postData => {
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await belongsTo.destroy({
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