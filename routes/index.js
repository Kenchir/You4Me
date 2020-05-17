let express = require("express");
let router = express.Router();
const User = require("../models/user"),
    request = require("request"),
    moment = require("moment"),
    Base64 = require("js-base64").Base64;
let accessToken = "Bearer nkQn5t1kpVBFSHOwpTgitoAJQ4l8";

//console.log(upload)

router.get("/home", (req, res) => res.render("index"));

router.get("/help", (req, res) => res.render("help"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/blog", (req, res) => res.render("blog"));
router.get("/about", (req, res) => res.render("about"));

router.post("/help", (req, res) => {
    const { county, subcounty, location, age, phone, fname, lname } = req.body;
    console.log(req.body);
    if (!county) {
        // console.log("error")
        req.flash("error", "County Missing");
        res.redirect("back");
        return;
    }
    if (!subcounty) {
        // console.log("error")
        req.flash("error", "Sub County Missing");
        res.redirect("back");
        return;
    }
    if (!fname) {
        // console.log("error")
        req.flash("error", "First name Missing");
        res.redirect("back");
        return;
    }
    if (!lname) {
        // console.log("error")
        req.flash("error", "Last name Missing");
        res.redirect("back");
        return;
    }
    if (!location) {
        // console.log("error")
        req.flash("error", "Location Missing");
        res.redirect("back");
        return;
    }
    if (!age) {
        // console.log("error")
        req.flash("error", "Age Missing");
        return res.redirect("back");
    }
    if (!phone) {
        // console.log("error")
        req.flash("error", "Phone number Missing");
        return res.redirect("back");
    }

    let phoneNumber = phone.split("");

    if (phoneNumber.length != 10) {
        req.flash("error", "Phone number must be in format of 0712345678");
        return res.redirect("back");
    }
    if (phoneNumber[0] != "0" || phoneNumber[1] != "7") {
        console.log("Phone Number");
        req.flash("error", "Phone number must be in format of 0712345678");
        return res.redirect("back");
    }
    phoneNumber = "254" + phone.slice(1);
    const timestamp = moment(new Date()).format("YYYYMMDDHHMMSS");
    let pass = Base64.encode(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
    );
    request({
        method: "POST",
        url: " https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        headers: {
            Authorization: accessToken,
        },
        json: {
            BusinessShortCode: "174379",
            Password: pass,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "50",
            PartyA: phoneNumber,
            PartyB: "174379",
            PhoneNumber: phoneNumber,
            CallBackURL: "https://siasia.herokuapp.com/api/property/payment/cb",
            //    "https://8081-db6e9531-a657-426e-ad2f-6e05bf8d1c77.ws-eu01.gitpod.io/api/property/payment/cb",
            AccountReference: "test",
            TransactionDesc: "test ",
        },
    },
        (error, response, body) => {
            if (error) throw new Error(error);
            else {
                console.log(body);
                //  console.log("here", body);
                switch (body.ResponseCode) {
                    case "0":
                        req.flash(
                            "success",
                            "Kindly check your phone to complete the registration and enter your Mpesa Pin"
                        );
                        res.redirect("back");
                        break;
                    default:
                        req.flash(
                            "error",
                            "There was an error in your phone number. Try the correct phone"
                        );
                        res.redirect("back");

                        break;
                }
            }
        }
    );
});
router.post('/donate', (req, res) => {
    const { amount, phone } = req.body;
    if (!phone) {
        // console.log("error")
        req.flash("error", "Phone number Missing");
        return res.redirect("back");
    }
    if (!amount) {
        req.flash("error", "Amount Missing");
        return res.redirect("back");
    }

    let phoneNumber = phone.split("");

    if (phoneNumber.length != 10) {
        req.flash("error", "Phone number must be in format of 0712345678");
        return res.redirect("back");
    }
    if (phoneNumber[0] != "0" || phoneNumber[1] != "7") {
        console.log("Phone Number");
        req.flash("error", "Phone number must be in format of 0712345678");
        return res.redirect("back");
    }
    phoneNumber = "254" + phone.slice(1);
    const timestamp = moment(new Date()).format("YYYYMMDDHHMMSS");
    let pass = Base64.encode(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
    );
    request({
        method: "POST",
        url: " https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        headers: {
            Authorization: accessToken,
        },
        json: {
            BusinessShortCode: "174379",
            Password: pass,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: "174379",
            PhoneNumber: phoneNumber,
            CallBackURL: "https://siasia.herokuapp.com/api/property/payment/cb",
            //    "https://8081-db6e9531-a657-426e-ad2f-6e05bf8d1c77.ws-eu01.gitpod.io/api/property/payment/cb",
            AccountReference: "test",
            TransactionDesc: "test ",
        },
    },
        (error, response, body) => {
            if (error) throw new Error(error);
            else {
                console.log(body);
                //  console.log("here", body);
                switch (body.ResponseCode) {
                    case "0":
                        req.flash(
                            "success",
                            "Kindly check your phone to complete the registration and enter your Mpesa Pin"
                        );
                        res.redirect("back");
                        break;
                    default:
                        req.flash(
                            "error",
                            "There was an error in your phone number. Try the correct phone"
                        );
                        res.redirect("back");

                        break;
                }
            }
        }
    );
})
router.post("/cb", (req, res, next) => {
    const { stkCallback } = req.body.Body;
    //console.log(stkCallback.ResultCode);
    if (stkCallback.ResultCode == 0) {
        //console.log("executed");
        Transaction.findOne({
            merchantRequestId: stkCallback.MerchantRequestID,
            checkoutRequestId: stkCallback.CheckoutRequestID,
        })
            .then((trans) => {
                trans.status = "completed";
                trans.save().then((transaction) => {
                    Property.findOne({ _id: transaction.houseId })
                        .then((house) => {
                            house.status = "active";
                            house.save();
                        })
                        .catch((err) => {
                            throw new Error(err);
                        });
                });
            })
            .then(() => {
                res.json({});
            })
            .catch((err) => {
                throw new Error(err);
            });
    } else {
        // console.log("here");
        Transaction.findOne({
            merchantRequestId: stkCallback.MerchantRequestID,
            checkoutRequestId: stkCallback.CheckoutRequestID,
        })
            .then((trans) => {
                trans.status = "failed";
                trans.save();
            })
            .then(() => {
                res.json({});
            })
            .catch((err) => {
                throw new Error(err);
            });
    }
});
const generateCredentials = () => {
    const options = {
        method: "GET",
        url: "https://sandbox.safaricom.co.ke/oauth/v1/generate",
        qs: { grant_type: "client_credentials" },
        headers: {
            "postman-token": "7257fb58-afa4-1f3f-adcb-380f462bcad1",
            "cache-control": "no-cache",
            authorization: "Basic QUNwbEc5ZmVBQTNQOTFaOExFT3pqV294TTFSeVphS0E6R3A1a2poSkl0dHd4MnZSNg==",
        },
    };

    request(options, function (error, response, body) {
        try {
            if (error) {
                console.log("Error", error);
                throw new Error(error);
            } else {
                // console.log(response.body);
                accessToken = JSON.parse(response.body);
                accessToken = "Bearer " + accessToken.access_token;

                console.log(accessToken);
                //console.log(accessToken);
            }
        } catch (err) {
            console.log("[Credentials error]", err.message);
        }
    });
};
generateCredentials();
setInterval(() => {
    generateCredentials();
}, 10000);

module.exports = router;