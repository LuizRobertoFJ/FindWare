const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  
  console.log("Token recebido no middleware:", req.cookies.token);

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    

    console.log("Conteúdo do Token decodificado:", user)
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;