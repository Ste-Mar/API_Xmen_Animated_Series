const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const CharacterSchema  = mongoose.Schema({
    id:{
        type: Number,
    },
    name: {
        type: String,
    },
    alias: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    powers:{
        type: Array,
    },
    img:{
        type: String,
    },
    affiliation: {
        type: String,
        
    },
    created:{
        type: Date,
        default : Date.now,
    }


});
CharacterSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Character', CharacterSchema)