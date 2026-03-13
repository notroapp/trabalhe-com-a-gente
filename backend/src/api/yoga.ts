import { createYoga } from 'graphql-yoga';
import { createAppSchema } from './schema/index.js';

const isProduction = process.env.NODE_ENV === 'production';

export const yoga = createYoga({
  schema: createAppSchema(),
  graphiql: !isProduction
});
