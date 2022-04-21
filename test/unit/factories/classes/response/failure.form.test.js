import {
    junkMessageGenerator
} from '../../../data/junk.data.generator';

import FailureForm from "../../../../../src/factories/classes/response/failure.form";

describe('ResForm', () => {

    let resForm;

    let message;
    let result;

    it('Variables List', () => {
        message = junkMessageGenerator();
        resForm = new FailureForm(message, result);

        expect(resForm.isSuccess).toBeFalsy();
        expect(resForm.message).toBe(message);
        expect(resForm.result).toEqual({});
    });

});