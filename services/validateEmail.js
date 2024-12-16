import Joi from "joi"

const validateEmail = (email) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Поле email не должно быть пустым.",
            "string.email": "Введите корректный email.",
            "any.required": "Поле email является обязательным."
        })
    })

    return schema.validate({email})
}

export default validateEmail;