class FormValidator {
  static async validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const matched = email.match(regex);
    if (!(matched)) {
      throw new Error('Isian email tidak berformat email')
    }
  }

  static async validatePassword(password, confirmPassword) {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    const matched = password.match(regex);
    if (!(matched)) {
      throw new Error('Password Harus ada minimal 1 angka, 1 huruf kecil, 1 huruf besar, dan 8 atau lebih karakter')
    }
    if (password != confirmPassword) {
      throw new Error('Password dan konfirmasi password tidak sama')
    }
  }

  static async validateTelephoneNo(telephoneNo) {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    const matched = telephoneNo.match(regex);
    if (!(matched)) {
      throw new Error('Format nomor telepon tidak sesuai')
    }
  }
}

export { FormValidator };