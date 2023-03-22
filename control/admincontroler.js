const mongoose = require('mongoose');
const { UploadModel, AdminModel } = require('../model/model');
const cloudinary = require('cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminmail } = require('../mailer');
require('dotenv').config()

const adminregist = (req, res) => {
    const information = req.body;
    let useremail = req.body.email;
    AdminModel.create(information, (err) => {
        if (err) {
            res.send({ message: "Email already used", status: false })
        } else {
            adminmail(useremail)
            res.send({ message: "saved", status: true })
        }
    })
}

const adminlogin = (req, res) => {
    const { email, password } = req.body;
    AdminModel.findOne({ email }, async (err, message) => {
        if (err) {
            res.send(err)
            console.log(err);
        } else {
            if (!message) {
                res.send({ status: false, message: "Email not found" })
            }
            else {
                const validPassword = await bcrypt.compare(password, message.password);
                if (validPassword) {
                    const token = jwt.sign({ _id: message._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
                    res.send({ token, message: "Token generated", status: true });
                } else {
                    res.send({ status: false, message: "Invaild password" })
                }
            }
        }
    })
}

const admin = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.send({ status: false, message: "Invalid Token" })
        } else {
            let id = decoded._id;
            AdminModel.find({ _id: id }, (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    if (result.length > 0) {
                        res.send({ result, status: true, message: "Valid Token" })
                    }
                    else {
                        console.log(result);
                        res.send({ message: "empty array" })
                    }
                }
            })
        }
    })

}

const file = (req, res) => {
    let userfile = req.body.file;
    cloudinary.v2.uploader.upload(userfile, { folder: "Ecommerce" }, (err, result) => {
        if (err) {
            res.send({ message: "Upload failed", status: false })
        } else {
            const myimage = result.url;
            UploadModel.create({ ...req.body, file: myimage, }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({ message: "Upload successfuly", status: true })
                }
            })
        }
    });
}

const adminfiles = (req, res) => {
    let adminId = req.body.adminId;
    UploadModel.find({ adminId }, (err, result) => {
        if (err) {
        } else {
            res.send({ result })
        }
    })
}

const delproduct = (req, res) => {
    let { id } = req.body;
    UploadModel.findByIdAndDelete({ _id: id }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ result });
        }
    })
}

module.exports = { adminregist, adminlogin, admin, file, adminfiles, delproduct }