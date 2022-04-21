import {
    junkMessageGenerator,
    junkProductGenerator
} from '../../../data/junk.data.generator';

import SuccessForm from "../../../../../src/factories/classes/response/success.form";

describe('ResForm', () => {

    let resForm;

    let message;
    let result;

    it('Variables List', () => {
        message = junkMessageGenerator();
        result = junkProductGenerator();
        resForm = new SuccessForm(message, result);

        expect(resForm.isSuccess).toBeTruthy();
        expect(resForm.message).toBe(message);
        expect(resForm.result).toEqual(result);
    });

});