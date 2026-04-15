 
const e = require("express");
const pool = require("../config/db");



// Adicionar produto
exports.adicionarProduto = async (req, res) => {
 try {
    const { nome, descricao, preco, quantidade } = req.body;
    const userId = req.user.id;

    // Verificar se o produto já existe para este usuário
    const produtoExistente = await pool.query(
      "SELECT * FROM produtos WHERE nome = $1 AND usuario_id = $2",
      [nome, userId]
    );
 
    let resultado;

    if (produtoExistente.rows.length > 0) {
      // Produto já existe - aumentar quantidade
      const produtoId = produtoExistente.rows[0].id;
      const novaQuantidade = parseInt(produtoExistente.rows[0].quantidade) + parseInt(quantidade);
      
      resultado = await pool.query(
        "UPDATE produtos SET quantidade = $1 WHERE id = $2 RETURNING *",
        [novaQuantidade, produtoId]
      );
      delete cache[userId]; // Limpar cache para este usuário

      res.status(200).json({
        mensagem: "Quantidade do produto atualizada com sucesso!",
        produto: resultado.rows[0]
      });
    } else {
      // Produto novo - inserir
      resultado = await pool.query(
        "INSERT INTO produtos (nome, descricao, preco, quantidade, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nome, descricao, preco, quantidade, userId]
      );

      delete cache[userId]; // Limpar cache para este usuário

      res.status(201).json({
        mensagem: "Produto adicionado com sucesso!",
        produto: resultado.rows[0]
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao adicionar produto" });
  }
};

// Listar produtos do usuário
  const cache = {}
  const ttl = 60 * 1000; // 1 minuto
exports.listarProdutos = async (req, res) => {

  const userId = req.user.id;
  const now = Date.now();

  // Limpar cache expirado
  if(cache[userId] && now - cache[userId].timestamp < ttl) {
     console.log("Dados retornados do cache para o usuário:", userId);
    return res.json(cache[userId].data);
    
  }
  try {
    const produtos = await pool.query("SELECT * FROM produtos WHERE usuario_id = $1", [userId]);
    cache[userId] = { data: produtos.rows, timestamp: now };
     console.log("Dados retornados do banco para o usuário:", userId);
   return res.json(cache[userId].data);
  

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar produtos" });
  }

} 

exports.deletarProduto = async (req, res) => {
  const produtoId = req.params.id;
  const userId = req.user.id;
  try {
    const resultado = await pool.query(
      "DELETE FROM produtos WHERE id = $1 AND usuario_id = $2 RETURNING *",
      [produtoId, userId]
    );  
      delete cache[userId]; // Limpar cache para este usuário
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado ou você não tem permissão para deletá-lo" });
    }
    res.json({ mensagem: "Produto deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao deletar produto" });
  }
};

exports.atualizarProduto = async (req, res) => {
  const produtoId = req.params.id;
  const userId = req.user.id;
  const { nome, descricao, preco, quantidade } = req.body;
  try {
    const resultado = await pool.query(
      "UPDATE produtos SET nome = $1, descricao = $2, preco = $3, quantidade = $4 WHERE id = $5 AND usuario_id = $6 RETURNING *",
      [nome, descricao, preco, quantidade, produtoId, userId]
    );  
      delete cache[userId]; // Limpar cache para este usuário
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado ou você não tem permissão para atualizá-lo" });
    }
    res.json({ mensagem: "Produto atualizado com sucesso!", produto: resultado.rows[0] });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar produto" });
  }   
};

exports.relatorio = async (req, res) => {
  const userId = req.user.id;
  try {

    const relatorio = await pool.query(
      "SELECT nome, COUNT(*) AS total_produtos, SUM(preco * quantidade) AS valor_total_estoque FROM produtos WHERE usuario_id = $1 GROUP BY nome",
      [userId]
    );
    const labels = relatorio.rows.map(row => row.nome);    
    const values = relatorio.rows.map(row => Number(row.valor_total_estoque));
   const totalGeralEstoque = values.reduce((acc, curr) => acc + curr, 0);
const quantidadeTotalItens = relatorio.rows.length;
    
    res.json({
      labels: labels,
      series: values,
      total_geral: totalGeralEstoque,
      quantidade_total_itens: quantidadeTotalItens
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao gerar relatório" });
  } 
};
