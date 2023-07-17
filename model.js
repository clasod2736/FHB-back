const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FHBSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    brews: {
        type: Object
    }
});

const FHB = mongoose.model('fhb', FHBSchema, 'FHB');

module.exports = FHB;