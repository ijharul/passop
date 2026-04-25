const breachService = require("../services/breachService");

const checkPasswordBreach = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: "Password required" });

    const result = await breachService.checkPasswordBreach(password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Breach check failed" });
  }
};

module.exports = { checkPasswordBreach };
