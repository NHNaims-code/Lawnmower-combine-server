const auth = require('../auth')
const Map = require('../models/map-schema');
const Tileset = require('../models/tileset-schema');
const User = require('../models/user-schema');
const bcrypt = require('bcryptjs');
const Nodemailer = require('nodemailer');

loggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: ""
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });

        return res.status(200).json({
            loggedIn: true,
            user: { //send all back except password hash
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                username: loggedInUser.username,
                email: loggedInUser.email,
                joinDate: loggedInUser.joinDate,
                maps: loggedInUser.maps,
                tilesets: loggedInUser.tilesets,
                comments: loggedInUser.comments,
                _id: loggedInUser._id
            }
        })
    } catch (err) {
        res.json(false);
    }
}

login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ success: false, errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ username: username });

        if (!existingUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    errorMessage: "Wrong username or password provided."
                })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    success: false,
                    errorMessage: "Wrong username or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        await res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            samesite: "lax"
        }).status(200).json({
            success: true,
            user: existingUser
        });
        next();
    } catch (err) {
        // console.error(err);
        return res.status({ success: false, errorMessage: err});
    }
}

logout = async (req, res, next) => {
    try {
        await res.cookie("token", "", {
            httpOnly: false,
            expires: new Date(0),
            secure: false,
            samesite: "lax"
        }).json({ success: true, message: "Logged Out" });
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, errorMessage: err })
    }
}

generateRandomKey = (length = 10) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = Math.floor(Math.random() * (characters.length + 1));
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
    return result;
}

register = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ success: false, errorMessage: "Please enter all required fields." });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }

        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Please enter the same password twice."
                })
        }
        
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const existingUserUsername = await User.findOne({ username: username });

        if (existingUserUsername) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt); 
        const key = generateRandomKey();

        const newUser = new User({
            firstName, lastName, email, username, passwordHash, key
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);

        await res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            samesite: "lax"
        }).status(200).json({
            success: true,
            user: savedUser
        });
        next();
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, errorMessage: err });
    }
}

changePassword = async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;
        if (!email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }

        // const userId = auth.verifyUser(req);
        // if (!userId) {
        //     return res.status(200).json({
        //         success: false,
        //         errorMessage: "You must be logged in to change your password."
        //     })
        // }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Could not find user to update password."
                })
        }
        const userId = existingUser._id;
        // Set the field for changingPassword to be the new password...
        await User.findOneAndUpdate({ _id: userId}, { changingPassword: password }).catch(err => {
            return res
                .status(500)
                .json({
                    success: false,
                    errorMessage: "Error with new password"
                });
        });

        // User is verified...
        // Send them an email with a verification code...
        const userKey = existingUser.key;
        const body = "http://34.193.24.27:3000/auth/verify?email=" + encodeURIComponent(email) + "&key=" + encodeURIComponent(userKey);
        const subject = "Password Reset Link";

        let transporter = Nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            service: "outlook",
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
            ciphers:'SSLv3'
            },
            auth: {
                user: 'lawnmower416@outlook.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
        let isError = false;
        let errorMsg;
        transporter.sendMail(
            {
                to: email,
                from: '"Lawnmower" <lawnmower416@outlook.com>', // Make sure you don't forget the < > brackets
                subject: subject,
                text: body, // Optional, but recommended
            }, function (err, response) {
                if(err) {
                    errorMsg = err;
                    isError = true;
                }
                transporter.close();
            }
        );
        console.log("Sent Mail?!");
        if (isError) { // Something went wrong...
            return res.status(500).json({
                success: false,
                "errorMessage": errorMsg
            });
        } else { // Mail was sent
            // Send 200 back to acknowledge that the email was sent...
            return res.status(200).json({
                success: true,
                message: "Check your email to reset your password."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({"success": false, "errorMessage":  "Something went wrong"});
    }
}

verifyUserPassword = async (req, res) => {
    try {
        const email = decodeURIComponent(req.query.email);
        const userKey = decodeURIComponent(req.query.key);

        const existingUser = await User.findOne({ email: email, userKey: userKey });

        if (!existingUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    errorMessage: "Invalid Credentials"
                })
        }

        if (existingUser.changingPassword == "") {
            return res
                .status(401)
                .json({
                    success: false,
                    errorMessage: "Invalid. Make sure to go through the reset password screen to reset your password!"
                }) 
        }

        const password = existingUser.changingPassword;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const newKey = generateRandomKey();

        await User.findOneAndUpdate({ email: email }, { passwordHash: passwordHash, changingPassword: "" , key: newKey });

        res.status(200).json({
            success: true,
            message: "Login Again with the New Password!"
        });
    } catch (err) {
        return res
        .status(500)
        .json({
            success: false,
            errorMessage: err
        })
    }
}

deleteAccount = async (req, res, next) => {
    try {
        const deleteUsername = req.body.username;
        const deletePassword = req.body.password;

        const existingUser = await User.findOne({ username: deleteUsername });
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Invalid Credentials."
                })
        }

        //check password
        const passwordCorrect = await bcrypt.compare(
            deletePassword,
            existingUser.passwordHash
        );
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    success: false,
                    errorMessage: "Invalid Credentials"
                })
        }

        const deletedUser = await User.findOneAndDelete({ _id: existingUser._id });

        //also logs out user
        await res.cookie("token", "", {
            httpOnly: false,
            expires: new Date(0),
            secure: false,
            samesite: "lax"
        }).status(200).json({
            success: true,
            user: deletedUser,
            message: "Account Deleted and logged out!"
        });
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({"success": false, errorMessage: "Something went wrong"});
    }
}

MapVerify = async (req, res, next) => {
    const collaborator = auth.verifyUser(req); // Returns the userId
    if (!collaborator) {
        return res.status(401).json({ success: false, errorMessage: "Unauthorized"});
    }
    const response = await Map.findOne({ _id: req.params.mapId, $or: [{owner: collaborator}, {collaborators: collaborator }] });
    if (response) {
        req.userId = collaborator;
        next(); // Pass to the next in pipeline
    }
    else return res.status(401).json({ success: false, errorMessage: "Unauthorized"});
};

TilesetVerify = async (req, res, next) => {
    const collaborator = auth.verifyUser(req); // Returns the userId
    if (!collaborator) {
        return res.status(401).json({ success: false, errorMessage: "Unauthorized"});
    }
    const response = await Tileset.findOne({ _id: req.params.tilesetId, $or: [{owner: collaborator}, {collaborators: collaborator }] });
    console.log("resposne", response);
    if (response) {
        req.userId = collaborator;
        next(); // Pass to the next in pipeline
    }
    else return res.status(401).json({ success: false, errorMessage: "Unauthorized"});
};

module.exports = {
    loggedIn,
    login,
    logout,
    register,
    changePassword,
    verifyUserPassword,
    deleteAccount,
    MapVerify,
    TilesetVerify
}