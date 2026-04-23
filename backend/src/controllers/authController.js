const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
// Registro

exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Preencha todos os campos" });
        }
        // Verificar se já existe email
        const usuarioExiste = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );    
        if (usuarioExiste.rows.length > 0) {
            return res.status(400).json({ mensagem: "Email já cadastrado" });
        }
        // Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);
        // Inserir novo usuário
        const novoUsuario = await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
            [nome, email, senhaHash]
        );
        res.status(201).json({ mensagem: "Usuário criado com sucesso", usuario: novoUsuario.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: "Erro ao registrar usuário" });
    }   
};

// =====================


exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.rows[0].senha
    );

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".onrender.com",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
   

    res.json({ mensagem: "Login bem-sucedido" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no login" });
  }
};


exports.getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await pool.query(
      "SELECT id, nome, email FROM usuarios WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json(user.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar usuário" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    res.json({ mensagem: "Logout bem-sucedido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no logout" });
  }
};
