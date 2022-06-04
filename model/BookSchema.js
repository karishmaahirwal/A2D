const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        bookName: {type: String},
        bookPrice: {type: Number},
        AuthorName: {type: String},
        CreatedBy:{type:String},
       
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Book', bookSchema);