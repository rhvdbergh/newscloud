'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema: SearchTerm 
var SearchTermSchema = new Schema({
    searchTerm: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    count: {type: Number, default: 1 }
});

module.exports = mongoose.model("SearchTerm", SearchTermSchema);