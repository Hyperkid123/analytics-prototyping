import { faker } from "@faker-js/faker";

type SubscriptionTier = "free" | "basic" | "business";

export type User = {
  id: string;
  avatar: string;
  birthday: Date;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: SubscriptionTier;
};

export function createRandomUser(): User {
  return {
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    subscriptionTier: faker.helpers.arrayElement(["free", "basic", "business"]),
  };
}
