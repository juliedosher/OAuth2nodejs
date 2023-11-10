/*  EXPRESS */

import express from "express";
import session from 'express-session'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20';

const app = express();
app.set('view engine', 'ejs');

app.use(session({
	resave: false,
  	saveUninitialized: true,
  	secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  	res.render('pages/auth');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));


/*  PASSPORT */

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.render('pages/success', {
	userProfile: userProfile
}));

app.get('/newtab', (req, res) => res.render('pages/newtab', {
	userProfile: userProfile
}));

app.get('/logout', function(req, res, next) {
	req.logout(function(err) {
		if (err) { return next(err); }
		userProfile = null
	  	res.redirect('/');
		console.log(userProfile)
	});
  });

app.get('/profile', (req, res) => res.send(userProfile));
app.get('/name', (req, res) => res.send(userProfile.displayName));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  	cb(null, obj);
});


/*  Google OAuth  */
const GOOGLE_CLIENT_ID="473681152374-fnt32hmh6hjgql8fkc2h7c6t9hb1ce36.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"
passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		userProfile=profile;
		return done(null, userProfile);
		}
	));
	// https://oauthnodejs.azurewebsites.net/google/callback
 
app.get('/auth/google', 
	passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  	passport.authenticate('google', { failureRedirect: '/error' }),
  	function(req, res) {
    res.redirect('/success');
});

