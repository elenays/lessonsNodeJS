const { Router } = require('express')

const router = Router()

router.get('/', (rec, res) => {
    res.render('courses', {
        title: 'Курсы',
        isCourses: true
    })
})

module.exports = router