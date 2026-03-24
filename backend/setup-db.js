const { Pool } = require("pg");
require("dotenv").config();

// Conectar ao postgres padrão para criar o banco
const poolAdmin = new Pool({
  user: "postgres",
  password: "0570",
  host: "localhost",
  port: 5432,
  database: "postgres"
});

async function setupDatabase() {
  try {
    console.log("🔄 Tentando criar database 'findware'...");
    
    // Criar database
    await poolAdmin.query("CREATE DATABASE findware;");
    console.log("✅ Database 'findware' criada com sucesso!");
    
    await poolAdmin.end();
    
    // Agora conectar ao banco findware para criar as tabelas
    const pool = new Pool({
      user: "postgres",
      password: "0570",
      host: "localhost", 
      port: 5432,
      database: "findware"
    });
    
    console.log("🔄 Criando tabelas...");
    
    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ Tabela 'usuarios' criada!");
    
    // Criar tabela de produtos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        quantidade INT NOT NULL DEFAULT 0,
        usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ Tabela 'produtos' criada!");
    
    // Criar índices
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_produtos_usuario_id ON produtos(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    `);
    
    console.log("✅ Índices criados!");
    console.log("\n✨ Database configurada com sucesso!");
    
    await pool.end();
    
  } catch (error) {
    if (error.code === "42P04") {
      console.log("⚠️ Database 'findware' já existe. Conectando...");
      
      const pool = new Pool({
        user: "postgres",
        password: "0570",
        host: "localhost",
        port: 5432,
        database: "findware"
      });
      
      try {
        // Tentar criar as tabelas mesmo assim (IF NOT EXISTS)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        await pool.query(`
          CREATE TABLE IF NOT EXISTS produtos (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            descricao TEXT,
            preco DECIMAL(10, 2) NOT NULL,
            quantidade INT NOT NULL DEFAULT 0,
            usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        console.log("✅ Tabelas prontas!");
        await pool.end();
      } catch (err) {
        console.log("✅ Tabelas já existem!");
        await pool.end();
      }
    } else {
      console.error("❌ Erro ao configurar database:");
      console.error("Código:", error.code);
      console.error("Mensagem:", error.message);
      process.exit(1);
    }
  }
}

setupDatabase();
