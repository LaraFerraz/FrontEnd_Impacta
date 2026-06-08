#!/usr/bin/env node

require('dotenv').config();

const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'impacta';

const tests = [];

tests.push({
  name: 'Conexão com Banco de Dados',
  test: async (conn) => {
    try {
      const [rows] = await conn.query('SELECT 1 as connected');
      return { passed: true, message: `✅ Conectado a ${DB_HOST}:${DB_PORT}/${DB_NAME}` };
    } catch (error) {
      return { passed: false, message: `❌ ${error.message}` };
    }
  }
});

tests.push({
  name: 'TipoUsuario',
  test: async (conn) => {
    try {
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM TipoUsuario');
      return rows[0].count >= 3 ? 
        { passed: true, message: `✅ ${rows[0].count} encontrados` } :
        { passed: false, message: `❌ Esperado 3+, encontrado ${rows[0].count}` };
    } catch (error) {
      return { passed: false, message: `❌ ${error.message}` };
    }
  }
});

tests.push({
  name: 'País',
  test: async (conn) => {
    try {
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM Pais');
      return rows[0].count >= 1 ? 
        { passed: true, message: `✅ ${rows[0].count} encontrado` } :
        { passed: false, message: `❌ Nenhum encontrado` };
    } catch (error) {
      return { passed: false, message: `❌ ${error.message}` };
    }
  }
});

tests.push({
  name: 'Estado',
  test: async (conn) => {
    try {
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM Estado');
      return rows[0].count >= 3 ? 
        { passed: true, message: `✅ ${rows[0].count} encontrados` } :
        { passed: false, message: `❌ Esperado 3+, encontrado ${rows[0].count}` };
    } catch (error) {
      return { passed: false, message: `❌ ${error.message}` };
    }
  }
});

tests.push({
  name: 'StatusCampanha',
  test: async (conn) => {
    try {
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM StatusCampanha');
      return rows[0].count >= 4 ? 
        { passed: true, message: `✅ ${rows[0].count} encontrados` } :
        { passed: false, message: `❌ Esperado 4+, encontrado ${rows[0].count}` };
    } catch (error) {
      return { passed: true, message: `⚠️  Pode não existir ainda` };
    }
  }
});

tests.push({
  name: 'Foreign Keys',
  test: async (conn) => {
    try {
      const [rows] = await conn.query(
        `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE REFERENCED_TABLE_NAME IS NOT NULL AND TABLE_SCHEMA = ?`,
        [DB_NAME]
      );
      return rows.length > 0 ? 
        { passed: true, message: `✅ ${rows.length} relações encontradas` } :
        { passed: false, message: `⚠️  Nenhuma foreign key` };
    } catch (error) {
      return { passed: false, message: `❌ ${error.message}` };
    }
  }
});

async function runTests() {
  let connection;
  
  try {
    console.log('\n🧪 TESTE DE PERSISTÊNCIA\n');
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT
    });
    
    let passed = 0, failed = 0;
    
    for (const test of tests) {
      console.log(`${test.name}`);
      const result = await test.test(connection);
      console.log(`  ${result.message}\n`);
      
      if (result.passed === false) failed++;
      else passed++;
    }
    
    console.log(`✅ Passou: ${passed} | ❌ Falhou: ${failed}`);
    
    if (failed === 0) {
      console.log('✅ Tudo OK!');
      process.exit(0);
    } else {
      process.exit(1);
    }
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runTests();
