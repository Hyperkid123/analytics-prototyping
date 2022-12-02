import { faker } from "@faker-js/faker";

export type EventContext = {
  url: string;
  org_id: number;
  account_id: number;
};

export const createRandomContext = (): EventContext => ({
  url: faker.internet.url(),
  org_id: faker.datatype.number(),
  account_id: faker.datatype.number(),
});
