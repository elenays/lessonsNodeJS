const { body } = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email', 'Введите корректный email')
        .isEmail()
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value })
                if (user) return Promise.reject('Такой email уже занят')

            } catch (err) {
                console.log(err)
            }
        })
        .normalizeEmail()
    ,
    body('password', 'Введите пароль')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim()
    ,
    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim()
    ,
    body('name', 'Имя должно быть минимум 3 символа')
        .isLength({ min: 3 })
        .trim()
]

exports.courseValidators = [
    body('title', 'Минимальная длинна названия 3 символа')
        .isLength({ min: 3 })
        .trim()
    ,
    body('price', 'Введите корректную цену')
        .isNumeric()
    ,
    body('img', 'Введите корректный url картинки')
        .isURL()
]