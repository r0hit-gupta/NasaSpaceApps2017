
// grab the mongoose module
var mongoose = require('mongoose');

// module.exports allows us to pass this to other files when it is called
var Soul = mongoose.model('Souls', {
    id : {type : String, required: true},
    lat : {type : Number, required: true},
    lng : {type : Number, required: true}
});

module.exports = Soul;
