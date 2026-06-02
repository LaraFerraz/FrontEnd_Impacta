# Persistência de Dados - Tarefa 4

## Volumes Docker
```yaml
services:
  mysql:
    volumes:
      - mysql_data:/var/lib/mysql
      - ./BackEnd_Impacta/scripts/seed.sql:/docker-entrypoint-initdb.d/01-seed.sql

volumes:
  mysql_data:
    driver: local
```

## Arquivos Criados

1. `scripts/seed.sql` - Dados iniciais (INSERT IGNORE)
2. `docker-entrypoint.sh` - Inicia: MySQL → initDb → populate → API
3. `.env.example` - Variáveis de referência
4. `scripts/test-persistence.js` - Valida persistência

## Teste Local

```bash
cd BackEnd_Impacta
npm install
cp .env.example .env
npm run db:init
npm run db:populate
npm run db:test
```

