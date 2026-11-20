import { NbComponentStatus } from '@liquid-js/lyr-core'

import { ShowcaseLogoName } from '../shared/showcase-logos'

/** The example data Relay's screens show: a webhook delivery API and one customer's console. */
export const RELAY_NAME = 'Relay'

export type CodeLanguage = 'curl' | 'node' | 'python'

/** The hero's sample: sending one event, in each language. */
export const CODE_SAMPLES: Record<CodeLanguage, string> = {
    curl: `curl https://api.relay.dev/v1/events \\
  -H "Authorization: Bearer rl_live_••••" \\
  -d type=order.created \\
  -d endpoint=ep_7f3a \\
  -d 'payload={"id":"ord_1042","total":8450}'`,
    node: `import Relay from '@relay/sdk';

const relay = new Relay(process.env.RELAY_KEY);

await relay.events.send({
  type: 'order.created',
  endpoint: 'ep_7f3a',
  payload: { id: 'ord_1042', total: 8450 },
});`,
    python: `from relay import Relay

relay = Relay(os.environ["RELAY_KEY"])

relay.events.send(
    type="order.created",
    endpoint="ep_7f3a",
    payload={"id": "ord_1042", "total": 8450},
)`
}

export const CUSTOMER_LOGOS: ShowcaseLogoName[] = ['northwind', 'contoso', 'fabrikam', 'tailspin', 'litware', 'proseware']

export interface Feature {
    icon: string
    title: string
    text: string
    /** Takes two columns of the grid. */
    wide?: boolean
}

export const FEATURES: Feature[] = [
    {
        icon: 'repeat-outline',
        title: 'Retries that back off, then give up gracefully',
        text: 'Failed deliveries retry on an exponential schedule for up to three days. Every attempt is logged with its response, and a dead-letter queue keeps what never arrived.',
        wide: true
    },
    { icon: 'shield-outline', title: 'Signed payloads', text: 'Every request carries an HMAC signature and a timestamp, so receivers verify both the sender and the freshness.' },
    { icon: 'flash-outline', title: 'Under 50 ms to dispatch', text: 'Events leave the queue in milliseconds, from three regions, with ordering kept per endpoint.' },
    { icon: 'activity-outline', title: 'See every attempt', text: 'Request, response, latency and the retry schedule, searchable for 30 days.' },
    { icon: 'code-outline', title: 'SDKs for six languages', text: 'Typed clients for Node, Python, Go, Ruby, Java and .NET, generated from one OpenAPI spec.' },
    { icon: 'globe-outline', title: 'Endpoints your customers manage', text: 'Embed the portal and let customers add endpoints, rotate secrets and replay events themselves.' }
]

export const STEPS = [
    { title: 'Create an endpoint', text: 'Register the URL that should receive events, in the console or with one API call.' },
    { title: 'Send events', text: 'Post a typed event with a JSON payload. Relay queues it, signs it and delivers it in order.' },
    { title: 'Watch it arrive', text: 'Follow every attempt in the log, set alerts on failures, and replay anything from the last 30 days.' }
]

export const STATS = [
    { value: '2.4B', label: 'events delivered' },
    { value: '99.99%', label: 'uptime, last 12 months' },
    { value: '38 ms', label: 'median dispatch' },
    { value: '3', label: 'regions' }
]

export type TierKey = 'free' | 'pro' | 'scale'

export interface Tier {
    key: TierKey
    name: string
    description: string
    /** Per month, billed monthly and yearly. */
    monthly: number
    yearly: number
    events: string
    features: string[]
    highlighted?: boolean
    action: string
}

export const TIERS: Tier[] = [
    {
        key: 'free',
        name: 'Free',
        description: 'For side projects and trying it out.',
        monthly: 0,
        yearly: 0,
        events: '10,000 events a month',
        features: ['2 endpoints', '3 days of logs', 'Community support'],
        action: 'Start free'
    },
    {
        key: 'pro',
        name: 'Pro',
        description: 'For products in production.',
        monthly: 49,
        yearly: 39,
        events: '1 million events a month',
        features: ['Unlimited endpoints', '30 days of logs', 'Replays and alerts', 'Email support'],
        highlighted: true,
        action: 'Start a trial'
    },
    {
        key: 'scale',
        name: 'Scale',
        description: 'For platforms with customers of their own.',
        monthly: 249,
        yearly: 199,
        events: '20 million events a month',
        features: ['Everything in Pro', 'Embedded customer portal', 'SSO and audit log', '99.99% SLA, priority support'],
        action: 'Talk to sales'
    }
]

export type ComparisonRow = Record<TierKey, string | boolean> & { feature: string }

export const COMPARISON: ComparisonRow[] = [
    { feature: 'Events a month', free: '10,000', pro: '1 million', scale: '20 million' },
    { feature: 'Endpoints', free: '2', pro: 'Unlimited', scale: 'Unlimited' },
    { feature: 'Log retention', free: '3 days', pro: '30 days', scale: '30 days' },
    { feature: 'Retries', free: true, pro: true, scale: true },
    { feature: 'Replays', free: false, pro: true, scale: true },
    { feature: 'Alerts', free: false, pro: true, scale: true },
    { feature: 'Customer portal', free: false, pro: false, scale: true },
    { feature: 'SSO and audit log', free: false, pro: false, scale: true },
    { feature: 'SLA', free: false, pro: false, scale: '99.99%' }
]

export const FAQ = [
    {
        question: 'What counts as an event?',
        answer: 'One event is one message you send us, however many endpoints it goes to and however many times we retry it. Replays count as new events.'
    },
    {
        question: 'What happens when I go over my plan?',
        answer: "We keep delivering. You get an email at 80% and 100%, and the next month's invoice adds the overage at the plan's per-event rate."
    },
    {
        question: 'Can I move between plans?',
        answer: 'Any time. Upgrades apply at once; downgrades apply from the next billing period, and your logs stay as long as the longer retention lasts.'
    },
    {
        question: 'Where are events stored?',
        answer: 'In the region you pick for each endpoint: EU West, US East or Asia Pacific. Logs never leave it.'
    }
]

export type Environment = 'live' | 'test'

export interface ConsoleStat {
    title: string
    value: string
    change: number
    /** What the change is measured against. */
    against: string
}

export const CONSOLE_STATS: ConsoleStat[] = [
    { title: 'Deliveries, 24 h', value: '184,302', change: 6.4, against: 'yesterday' },
    { title: 'Success rate', value: '99.72%', change: 0.08, against: 'last week' },
    { title: 'p95 latency', value: '412 ms', change: -11.2, against: 'last week' },
    { title: 'Retries', value: '1,318', change: 24.5, against: 'yesterday' }
]

export const DELIVERY_HOURS = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']
export const DELIVERIES = [4100, 2900, 2300, 3800, 8900, 12400, 13900, 14800, 15200, 11600, 8700, 6200]
export const FAILED = [12, 9, 7, 14, 41, 58, 73, 66, 240, 48, 31, 19]

export type DeliveryStatus = 'delivered' | 'failed' | 'pending'

export const DELIVERY_STATUS: Record<DeliveryStatus, NbComponentStatus> = {
    delivered: 'success',
    failed: 'danger',
    pending: 'warning'
}

export interface Endpoint {
    id: string
    url: string
    region: string
    successRate: number
}

export const ENDPOINTS: Endpoint[] = [
    { id: 'ep_7f3a', url: 'https://api.acme.com/hooks/relay', region: 'EU West', successRate: 99.9 },
    { id: 'ep_c21d', url: 'https://billing.acme.com/events', region: 'EU West', successRate: 99.4 },
    { id: 'ep_90be', url: 'https://warehouse.acme.io/in', region: 'US East', successRate: 97.1 },
    { id: 'ep_41aa', url: 'https://staging.acme.com/hooks', region: 'US East', successRate: 92.8 }
]

export interface Attempt {
    at: string
    status: number
    latency: number
}

export interface DeliveryEvent {
    id: string
    type: string
    endpoint: string
    status: DeliveryStatus
    attempts: Attempt[]
    /** In milliseconds, of the last attempt. */
    latency: number
    at: Date
    payload: string
    response: string
}

const TYPES = ['order.created', 'order.paid', 'invoice.sent', 'invoice.paid', 'customer.updated', 'shipment.dispatched', 'refund.issued']
const RESPONSES: Record<DeliveryStatus, string> = {
    delivered: `HTTP/1.1 200 OK
content-type: application/json
x-request-id: req_9c2e1b

{"received":true}`,
    failed: `HTTP/1.1 503 Service Unavailable
content-type: text/plain
retry-after: 30

upstream connect error or disconnect/reset before headers`,
    pending: 'Queued: next attempt in 4 min (attempt 3 of 8)'
}

// A fixed series of recent events, newest first, with a few failures and one still retrying.
export const EVENTS: DeliveryEvent[] = Array.from({ length: 48 }, (_, index) => {
    const status: DeliveryStatus = index % 11 === 4 ? 'failed' : index % 17 === 9 ? 'pending' : 'delivered'
    const endpoint = ENDPOINTS[(index * 7) % ENDPOINTS.length]
    const type = TYPES[(index * 5) % TYPES.length]
    const at = new Date(Date.UTC(2026, 5, 17, 16, 42, 7) - index * 7 * 60_000 - (index % 5) * 11_000)
    const latency = status === 'delivered' ? 180 + ((index * 37) % 420) : status === 'failed' ? 8_000 + (index % 3) * 2_000 : 0
    const attempts: Attempt[] =
        status === 'delivered'
            ? [{ at: '0 s', status: 200, latency }]
            : status === 'failed'
                ? [
                    { at: '0 s', status: 503, latency: 10_002 },
                    { at: '30 s', status: 503, latency: 10_001 },
                    { at: '2 min', status: 502, latency: 1_204 }
                ]
                : [
                    { at: '0 s', status: 429, latency: 311 },
                    { at: '30 s', status: 429, latency: 298 }
                ]
    const id = `evt_${(0x3a1f0 + index * 2713).toString(16)}`
    return {
        id,
        type,
        endpoint: endpoint.id,
        status,
        attempts,
        latency,
        at,
        payload: JSON.stringify(
            {
                id,
                type,
                created: at.toISOString(),
                data: { id: `ord_${1042 + index}`, customer: 'cus_4b19', total: 8450 - index * 115, currency: 'USD' }
            },
            null,
            2
        ),
        response: RESPONSES[status]
    }
})

export interface ApiKey {
    id: string
    name: string
    /** The key's first characters, all that's shown after it's created. */
    prefix: string
    environment: Environment
    created: Date
    lastUsed?: Date
}

export const KEYS: ApiKey[] = [
    { id: 'key_1', name: 'Production API', prefix: 'rl_live_8f2a', environment: 'live', created: new Date(2026, 1, 3), lastUsed: new Date(2026, 5, 17, 16, 40) },
    { id: 'key_2', name: 'Billing service', prefix: 'rl_live_c91d', environment: 'live', created: new Date(2026, 2, 21), lastUsed: new Date(2026, 5, 17, 9, 12) },
    { id: 'key_3', name: 'CI pipeline', prefix: 'rl_test_02be', environment: 'test', created: new Date(2026, 4, 2), lastUsed: new Date(2026, 5, 16, 22, 5) },
    { id: 'key_4', name: 'Local development', prefix: 'rl_test_77a0', environment: 'test', created: new Date(2026, 4, 28) }
]

/** A new key's secret, shown once. */
export const newKeySecret = (environment: Environment) =>
    `rl_${environment}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 14)}`

export const DOCS_NAV = [
    { title: 'Getting started', pages: ['Quickstart', 'Authentication', 'Endpoints'] },
    { title: 'Events', pages: ['Sending events', 'Payloads', 'Ordering', 'Retries'] },
    { title: 'Receiving', pages: ['Verifying signatures', 'Idempotency', 'Replays'] },
    { title: 'Reference', pages: ['REST API', 'SDKs', 'Errors'] }
]

export const DOCS_MARKDOWN = `# Verifying signatures

Every request Relay sends carries a signature, so your receiver can be sure the event came from Relay and
hasn't been changed on the way. Verifying takes three steps.

## The headers

| Header | Example | Meaning |
| --- | --- | --- |
| \`relay-id\` | \`evt_3a1f0\` | The event's id, the same on every attempt |
| \`relay-timestamp\` | \`1781541727\` | When this attempt was signed, in Unix seconds |
| \`relay-signature\` | \`v1,bWF…\` | The version and the base64 HMAC of the body |

## Compute the signature

Concatenate the id, the timestamp and the raw request body with full stops, and take an HMAC-SHA256 of it with
your endpoint's secret. Compare it to the header with a constant-time comparison.

\`\`\`ts
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verify(secret: string, headers: Headers, body: string): boolean {
    const signed = \`\${headers.get('relay-id')}.\${headers.get('relay-timestamp')}.\${body}\`;
    const expected = createHmac('sha256', secret).update(signed).digest('base64');
    const [, given] = (headers.get('relay-signature') ?? '').split(',');
    return given !== undefined && timingSafeEqual(Buffer.from(expected), Buffer.from(given));
}
\`\`\`

The SDKs do this for you: \`relay.webhooks.verify(secret, headers, body)\` throws when the signature doesn't match.

## Reject stale timestamps

A captured request could be replayed later. Refuse any attempt whose timestamp is more than five minutes
old; Relay signs every retry afresh, so a late retry is never stale.

## Rotating secrets

When you rotate an endpoint's secret, both the old and the new one are valid for 24 hours, and Relay sends two
signatures in the header, separated by a space. Accept the request if either matches.

> **Tip:** verify the raw body, as received. Parsing and re-serialising JSON changes its bytes, and the signature
> with them.
`
