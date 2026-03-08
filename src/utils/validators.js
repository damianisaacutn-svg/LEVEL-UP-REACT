export const validateName = name => {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,}$/
  return regex.test(name)
}

export const validatePassword = password => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/

  return regex.test(password)
}

export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return regex.test(email)
}
