import { parseNumber, isValidNumber } from 'libphonenumber-js'

class Expression {
  constructor() {
    this.rules = []
  }

  validate(value) {
    return this.rules.map(x => x(value)).every(validated => validated)
  }

  phone() {
    this.rules.push(value => isValidNumber(value))

    return this
  }

  email() {
    this.rules.push((value) => {
      const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i; // eslint-disable-line

      return regex.test(value)
    })

    return this
  }

  password() {
    this.rules.push((value) => {
      // const hasUpperCase = /[A-Z]/.test(value)
      // const hasLowerCase = /[a-z]/.test(value)
      // const hasNumbers = /\d/.test(value)
      // const hasNonalphas = /\W/.test(value)
      if (value.length >= 8) {
        return true
      }
      return false
    })

    return this
  }

  name() {
    this.rules.push((value) => {
      const regex = /^[a-z]+([a-z- ',.-]?)+[a-z.]+$/i

      return regex.test(value)
    })

    return this
  }

  cvv() {
    this.rules.push((value) => {
      const regex = /^[0-9]{3,4}$/i

      return regex.test(value)
    })

    return this
  }

  string() {
    this.rules.push(value => typeof value === 'string' || value instanceof String)

    return this
  }

  min(number) {
    this.rules.push(value => value.length <= number)

    return this
  }

  max(number) {
    this.rules.push(value => value.length >= number)

    return this
  }

  length(number) {
    this.rules.push(value => value.length === number)

    return this
  }

  required() {
    this.rules.push(value => value !== null && value.length !== 0)

    return this
  }

  boolean() {
    this.rules.push(value => value === true)

    return this
  }
}

const validate = (fields, schema) => {
  const names = Object.keys(fields)

  for (let i = 0; i < names.length; i += 1) {
    const key = names[i]
    const field = fields[key]
    const { expression, message } = schema[key]

    if (!expression.validate(field)) {
      return { field: key, message }
    }
  }

  return null
}

const string = () => {
  const vali = new Expression()

  return vali.string()
}

const name = () => {
  const vali = new Expression()

  return vali.name()
}

const phone = () => {
  const vali = new Expression()

  return vali.phone()
}

const email = () => {
  const vali = new Expression()

  return vali.email()
}

const password = () => {
  const vali = new Expression()

  return vali.password()
}

const cvv = () => {
  const vali = new Expression()

  return vali.cvv()
}

const boolean = () => {
  const vali = new Expression()

  return vali.boolean()
}

export default {
  validate,
  boolean,

  string,
  name,
  phone,
  email,
  password,
  cvv,
}
