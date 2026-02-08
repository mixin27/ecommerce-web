import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const isProd = process.env.NODE_ENV === 'production';

const config: CodegenConfig = {
  overwrite: true,
  schema: isProd
    ? process.env.NEXT_GRAPHQL_ENDPOINT!
    : 'http://localhost:4000/graphql',
  documents: './**/*.{tsx,ts,graphql}',
  ignoreNoDocuments: true,
  generates: {
    './graphql/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
    //     "./graphql/generated/graphql.ts": {
    //       plugins: [
    //         "typescript",
    //         "typescript-operations",
    //         "typescript-react-apollo",
    //       ],
    //       config: {
    //         withHooks: true,
    //       },
    //     },
  },
};

export default config;
