import faker from 'faker';

// @Depreacted

export const junkEmailGenerator = () => faker.internet.email();
export const junkUsernameGenerator = () => faker.internet.userName();
export const junkPasswordGenerator = () => faker.internet.password();
export const junkUserFormGenerator = () => {
    const email = junkEmailGenerator();
    const password = junkPasswordGenerator();

    return { email, password };
}


export const getNickname = () => faker.finance.accountName();
export const getShortDescription = () => faker.lorem.word();
export const getLongDescription = () => faker.lorem.sentence();

export const getId = () => faker.internet.userName();
export const getEmail = () => faker.internet.email();
export const getUsername = () => faker.internet.userName();
export const getPassword = () => faker.internet.password();
export const getUserForm = () => {
    const email = getUsername();
    const password = getPassword();

    return { email, password };
}