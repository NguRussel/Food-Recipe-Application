export const  register = async (req, res) => {};
export const  login = async (req, res) => {};
export const  logout = async (req, res) => {};      
export const  reset2FA = async (req, res) => {
  // Logic to reset 2FA
  res.status(200).json({ message: "2FA reset" });
};
export const  verify2FA = async (req, res) => {
  // Logic to verify 2FA code
  res.status(200).json({ message: "2FA verified" });
};
export const  setup2FA = async (req, res) => {
  // Logic to set up 2FA (e.g., generate a QR code)
  res.status(200).json({ message: "2FA setup" });
};
export const authStatus = async (req, res) => {};