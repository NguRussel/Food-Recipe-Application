import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js"; // Assuming you have a User model defined in models/User.js

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username });
            if(!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect password.' });

        } catch (error) {
            console.error("Authentication error:", error);
            return done(error);
        }
    }       
));
passport.serializeUser((user, done) => {
    console.log("We are inside serializeUser");
    done(null, user._id); // Serialize the user ID
}
);
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find the user by ID
        done(null, user); // Attach the user to the request object
    } catch (error) {
        console.error("Deserialization error:", error);
        done(error, null);
    }
});