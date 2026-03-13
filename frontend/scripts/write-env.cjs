const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, '..', 'public', 'env.js');
const graphqlUrl = process.env.FRONTEND_GRAPHQL_URL || 'http://localhost:4000/graphql';

const contents = `globalThis.__env = { FRONTEND_GRAPHQL_URL: ${JSON.stringify(graphqlUrl)} };`;

fs.writeFileSync(outputPath, contents, 'utf8');
