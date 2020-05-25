const { Schema, model } = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String
})

course.virtual('fullPrice').get((a, b, doc) => {
    return `${ doc.price } rub`
})

module.exports = model('Course', course)