import passwordComplexity from "joi-password-complexity";

const validatePassword = (password) => {
    const schema = passwordComplexity({
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
    })
    return schema.validate(password)
}

export default validatePassword;