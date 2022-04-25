import {
    junkMessageGenerator, 
    junkMessageListGenerator, 
    junkMeesageErrorGenerator, 
    junkProductGenerator, 
    junkProductListGenerator
} from './junk.data.generator';
import {
    getNickname,
    getShortDescription,
    getLongDescription,
    getEmail,
    getUsername,
    getPassword,
    getUserForm
} from './junk.user.generator';

describe('JunkGenerator', () => {

    let funcType;
    beforeAll(() => funcType = 'function');

    it('Function List', () => {
        expect(typeof junkMessageGenerator).toBe(funcType);
        expect(typeof junkMessageListGenerator).toBe(funcType);
        expect(typeof junkMeesageErrorGenerator).toBe(funcType);
        expect(typeof junkProductGenerator).toBe(funcType);
        expect(typeof junkProductListGenerator).toBe(funcType);
        
        expect(typeof getNickname).toBe(funcType);
        expect(typeof getShortDescription).toBe(funcType);
        expect(typeof getLongDescription).toBe(funcType);
        expect(typeof getEmail).toBe(funcType);
        expect(typeof getUsername).toBe(funcType);
        expect(typeof getPassword).toBe(funcType);
        expect(typeof getUserForm).toBe(funcType);
    });

    it('Function Return', () => {
        const array = junkMessageListGenerator(10);
        const error = junkMeesageErrorGenerator('hello');

        expect(array.length).toBe(10);
        expect(error).toEqual(new Error('hello'));
    })
});