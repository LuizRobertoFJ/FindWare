const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  adicionarProduto,
  listarProdutos,
  deletarProduto,
  atualizarProduto,
  relatorio
} = require("../controllers/produtoController.js");

router.post("/", authMiddleware, adicionarProduto);
router.get("/", authMiddleware, listarProdutos);
router.delete("/:id", authMiddleware, deletarProduto);
router.put("/:id", authMiddleware, atualizarProduto);
router.get("/relatorio", authMiddleware, relatorio);

module.exports = router;