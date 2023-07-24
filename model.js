const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FHBSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    currentBrews: {
        menuName: String,
        methodName: String,
        serve: Number,
        coffee: Number,
        roasting: String,
        grind: String
    },
    oldBrews: [{
        order: Number, 
        date: String,
        menuName: String,
        methodName: String,
        serve: Number,
        coffee: Number,
        roasting: String,
        grind: String
    }],
    favourites: [{
        favName: String,
        order: Number, 
        date: String,
        menuName: String,
        methodName: String,
        serve: Number,
        coffee: Number,
        roasting: String,
        grind: String,
        description: String
    }]
});

const FHB = mongoose.model('fhb', FHBSchema, 'FHB');

module.exports = FHB;