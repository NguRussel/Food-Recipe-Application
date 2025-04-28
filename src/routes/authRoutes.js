import { Router} from 'express';
import passport from 'passport';


const router = express.Router();

//Register route
router.post('/register', (req, res) => {
    // Registration logic here
    res.send('User registered successfully!');
});

//Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

//Logout route
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

//MFA route
router.post('/2fa/setup', (req, res) => {
    // MFA logic here
    res.send('MFA setup or verification successful!');
});

//Verify MFA route
router.post('/2fa/verify', (req, res) => {
    // MFA verification logic here
    res.send('MFA verification successful!');
});

//Resend MFA route
router.post('/2fa/resend', (req, res) => {
    // Resend MFA logic here
    res.send('MFA code resent!');
});

//Password reset route
router.post('/reset-password', (req, res) => {
    // Password reset logic here
    res.send('Password reset link sent!');
});

//Auth Status route
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Example route
router.get('/', (req, res) => {
    res.send('Auth route is working!');
});

export default router;
