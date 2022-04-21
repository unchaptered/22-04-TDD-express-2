import faker from "faker";
export const junkMessageGenerator = () => faker.lorem.sentences();
export const junkMessageListGenerator = (length) => Array.from({ length }, () => junkMessageGenerator());
export const junkMeesageErrorGenerator = (message) => new Error(message);
export const junkProductGenerator = () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price()
});
export const junkProductListGenerator = (length) => Array.from({ length }, () => junkProductGenerator());