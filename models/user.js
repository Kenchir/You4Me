var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema } = mongoose;
var UserSchema = new mongoose.Schema({
    fname: {
        type: String,
    },

    lname: {
        type: String,
    },
    location: {
        type: String,
    },

    age: {
        type: Number,
    },
    phone: {
        type: String,
    },
    county: {
        type: String,
    },
    subcounty: {
        type: String,
    },
}, { timestamps: true });

UserSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        county: this.county,
        subcounty: this.subcounty,
        fname: this.fname,
        lname: this.lname,
        location: this.location,
        age: this.age,
        phone: this.phone,

        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);