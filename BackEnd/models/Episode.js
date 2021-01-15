const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const EpisodeSchema  = mongoose.Schema({
    id:{
      type:Number,  
    },
    title: {
        type: String,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    air_date: {
        type: String
    },
    created:{
        type: Date,
        default : Date.now,
    },
    plot: {
        type: String,
    }

});
EpisodeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Episode', EpisodeSchema)