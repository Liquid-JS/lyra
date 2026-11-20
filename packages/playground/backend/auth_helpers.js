/** Decodes a base64url string, such as a JWT's payload, as UTF-8 text. */
export function urlBase64Decode(str) {
    if (str.length % 4 === 1) {
        throw new Error('Illegal base64url string!')
    }
    return Buffer.from(str, 'base64url').toString('utf8')
}
