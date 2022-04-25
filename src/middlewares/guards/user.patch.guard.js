import ResFormFactory from "../../factories/res.form.factory";

const formKey = new Set(['nickname', 'short', 'long', 'email', 'social']);

// 최소한 한개는 포함해야함.
export const userPatchGuard = (req, res, next) => {

    let hasAnyKey;
    const datas = req?.body;
    for (const key in datas)
        if (formKey.has(key))
            hasAnyKey = true;
    if (hasAnyKey) return next();

    const message = 'At least, one key is necessary';
    const resJson = ResFormFactory.getFailureForm(message);
    return res.status(400).json(resJson);

};