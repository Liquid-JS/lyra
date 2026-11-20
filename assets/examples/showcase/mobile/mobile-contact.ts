/** A phone number as a `tel:` or `sms:` link takes it, without the spaces it's shown with. */
export function dialable(phone: string): string {
    return phone.replace(/\s+/g, '')
}
