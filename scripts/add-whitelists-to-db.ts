import { exit } from "process";
import { whitelists } from "knex/types/tables";
import Knex from "knex";

declare module "knex/types/tables" {
  interface whitelists {
    address: string;
  }
}

(async () => {
  const whitelistedAddresses: string[] = [];

  const knex = Knex({
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

  await Promise.all(
    whitelistedAddresses.map((address) =>
      knex<whitelists>("whitelists")
        .insert({ address })
        .onConflict("address")
        .ignore()
    )
  );

  exit();
})();
