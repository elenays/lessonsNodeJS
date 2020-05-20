const { Router } = require('express')

const router = Router()

router.get('/', (rec, res) => {
    res.render('index', {
        title: 'Главная страница',
        isHome: true
    })
})

module.exports = router