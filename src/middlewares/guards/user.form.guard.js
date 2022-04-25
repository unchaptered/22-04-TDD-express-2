import ResFormFactory from "../../factories/res.form.factory";

const formKey = ['email', 'password'];

// 무조건 전부 있어야함
export const userFormGuard = (req, res, next) => {

    const target = new Set([...formKey]);
    const datas = req?.body;
    
    for (const key in datas) target.delete(key);
    if (target.size === 0) return next();

    const message = [...target].map(val => val + ' is necessary');
    const resJson = ResFormFactory.getFailureForm(message);
    return res.status(400).json(resJson);

}