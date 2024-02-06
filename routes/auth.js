const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')



//////////DANS TOUS LES CAS, DANS POSTMAN, TOUJOURS AJOUTER DANS LES HEADERS "CONTENT-TYPE - APPLICATION/JS" ET ENTRER ELS DONNEES EN RAW - HTML"  

router.get('/protected', requireLogin, (req,res)=>{
    res.send("hello user")
})

////// Route signup

////Approche propre

// router.post('/signup',(req,res)=>{
//     const {name,email,password} = req.body
//     if(!email || !password || !name){
//         return res.status(422).json({error:"please add all the fields"})
//     }

//     User.findOne({email:email})
//     .then((savedUser)=>{
//         if(savedUser){
//             return res.status(422).json({error:"user already exists with that email"})
//         }
//         bcrypt.hash(password,12)
//         .then(hashedpassword=>{
//             const user = new User({
//                 email,
//                 password:hashedpassword,
//                 name
//             })                
//         user.save()
//             .then(user=>{
//                 res.json({message:"saved successfully"})
//             })
//             .catch(err=>{
//                 console.groupCollapsed(err)
//             })
//         })
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })

////Approche MVP

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields..." });
    }

    User.findOne({ email:email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" });
            }

            // Créer un nouvel utilisateur avec le mot de passe en clair
            const user = new User({
                email,
                password, // Sauvegarder le mot de passe en clair directement
                name
            });

            user.save()
                .then(user => {
                    res.json({ message: "saved successfully" });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "An error occurred during the sign up process" });
                });
        })
        .catch(err => {
            console.log(err);
        });
});

////// Routes signin

////Approche propre

// router.post('/signin',(req,res)=>{
//     const{email,password} = req.body
//     if(!email || !password){
//         return res.status(422).json({error:"please add email or password"})
//     }
//     User.findOne({email:email})
//     .then(savedUser=>{
//         if(!savedUser){
//             return res.status(422).json({error:"Invalid Email or password"})
//         }
//         bcrypt.compare(password,savedUser.password)
//         .then(doMatch=>{
//             if(doMatch){
//                 //res.json({message:"usccessfully signed in"})
//                 const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
//                 res.json({token})
//             }
//             else{
//                 return res.status(422).json({error:"Invalid Email or password"})
//             }
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     })
// })

////Approche MVP

router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password." });
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password." });
            }

            // Ici, on compare directement les mots de passe en clair (non sécurisé).
            if (password === savedUser.password) {
                // Si les identifiants sont corrects, renvoyer une confirmation sans token JWT.
                res.json({ message: "Successfully signed in", userId: savedUser._id });
            } else {
                return res.status(422).json({ error: "Invalid email or password." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred during the sign in process." });
        });
});

module.exports = router