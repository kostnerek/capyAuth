export const validateMail = (email) => {
    const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;
    const emailParts = email.split('@');
    if(emailParts.length !== 2) return false

    var account = emailParts[0];
    var address = emailParts[1];

    if(account.length > 64) return false
    else if(address.length > 255) return false

    const domainParts = address.split('.');
    if (domainParts.some(function (part) {
        return part.length > 63;
    })) return false;

    if (!tester.test(email)) return false;
    return true;
};

export const validatePassword = (password) => {
    if (password.length < 8)      return false
    if (password.length > 32)     return false
    if (!password.match(/[0-9]/)) return false
    if (!password.match(/[a-z]/)) return false
    if (!password.match(/[A-Z]/)) return false
    return true
}

export const validateUsername = (username) => {
    if (username.length < 4)      return false
    if (username.length > 32)     return false
    if (!username.match( /^[a-zA-Z0-9]+$/)) return false
    /* if (!username.match(/[a-z]/)) return false
    if (!username.match(/[A-Z]/)) return false */
    return true
}