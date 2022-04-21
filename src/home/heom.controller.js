import ResFormFactory from '../factories/res.form.factory';

export const testPath = (req, res) => {
    const error = new Error('testasdfasfs');
    const object = new Object();

    const resJson = ResFormFactory.getSuccessForm( { name: error.name, message:error.message } , object);
    return res.status(404).json(resJson);
}
export const notFoundPath = (req, res) => {
    const resJson = ResFormFactory.getFailureForm('You try to access with empty path');
    return res.status(404).json(resJson);
};