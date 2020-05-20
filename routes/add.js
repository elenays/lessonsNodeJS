const { Router } = require('express')

const router = Router()

router.get('/', (rec, res) => {
    res.render('add', {
        title: 'Добавить',
        isAdd: true
    })
})

module.exports = router