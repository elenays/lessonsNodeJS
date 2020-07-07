const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')

const router = Router()

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const coursesList = await Course.find()
            .populate('userId', 'email name')
            .select('title price img')
            .then(docs => docs.map(doc => doc.toObject({ virtuals: true }))) //mongoose возвращает не обычный object, а свой документ с кучей разных лишних вещей

        res.render('coursesList', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            coursesList
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)
            .then(doc => doc.toObject({ virtuals: true }))
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Редактировать ${ course.title }`,
            course
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit/', auth, async (req, res) => {
    try {
        const { id } = req.body
        delete req.body.id //удаляем, чтобы он не попал в req.body
        const course = await Course.findById(id)
            .then(doc => doc.toObject({ virtuals: true }))
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        //Object.assign(course, req.body) 
        //await course.save() <- это вообще не работает
        await Course.findByIdAndUpdate(id, req.body) // <- сюда
        res.redirect('/courses')

    } catch (err) {
        console.log(err)
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .then(doc => doc.toObject({ virtuals: true }))
        res.render('course', {
            layout: 'empty',
            title: `Курс ${ course.title }`,
            course
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router