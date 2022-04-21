import {
    junkMessageGenerator,
    junkProductGenerator
} from '../../../data/junk.data.generator';

import ResForm from "../../../../../src/factories/classes/response/res.form";

describe('ResForm', () => {

    let resForm;

    let message;
    let result;

    it('Variables List', () => {
        message = junkMessageGenerator();
        result = junkProductGenerator();
        resForm = new ResForm(message, result);

        expect(resForm.isSuccess).toBeUndefined();
        expect(resForm.message).toBe(message);
        expect(resForm.result).toEqual(result);
    });

});