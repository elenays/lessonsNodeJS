const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .then(docs => docs.map(doc => doc.toObject({ virtuals: true }))) //mongoose возвращает не обычный object, а свой документ с кучей разных лишних вещей
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id).then(doc => doc.toObject({ virtuals: true }))

    res.render('course-edit', {
        title: `Редактировать ${ course.title }`,
        course
    })
})

router.post('/edit/', async (req, res) => {
    const { id } = req.body
    delete req.body.id //удаляем, чтобы он не попал в req.body
    await Course.findByIdAndUpdate(id, req.body) // <- сюда
    res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).then(doc => doc.toObject({ virtuals: true }))
    res.render('course', {
        layout: 'empty',
        title: `Курс ${ course.title }`,
        course
    })
})

module.exports = router