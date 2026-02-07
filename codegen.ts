import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "./**/*.{tsx,ts,graphql}",
  ignoreNoDocuments: true,
  generates: {
    "./graphql/generated/": {
      preset: "client",
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
