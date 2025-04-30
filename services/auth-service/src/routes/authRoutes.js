import { Router } from "express";
import passport from "passport";
import { 
    register, 
    login,
    logout,
    reset2FA,
    verify2FA,
    setup2FA,
    authStatus
     } from "../controllers/authController.js";

const router = Router();


// Register route
router.post("/register", register); 


// Login route
router.post("/login", passport.authenticate("local", { session: true }), login); // Use passport for local authentication

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

//Authentication routes
router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "Authenticated", user: req.user });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

// Auth status route
router.get("/status", authStatus);

// MFA status route
router.get("/mfa/status", (req, res) => {
  if (req.user) {
    return res.status(200).json({ isMfaActive: req.user.isMfaActive });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

// MFA routes
router.post("/mfa/setup", (req, res) => {
  // Logic to set up MFA (e.g., generate a QR code)
  res.status(200).json({ message: "MFA setup" });
});

// MFA verification route
router.post("/mfa/verify", (req, res) => {
  // Logic to verify MFA code
  res.status(200).json({ message: "MFA verified" });
});

//reset route
router.post("/2fa/reset", reset2FA);

export default router;

