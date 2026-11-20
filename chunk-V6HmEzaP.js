var u={curl:`curl https://api.relay.dev/v1/events \\
  -H "Authorization: Bearer rl_live_\u2022\u2022\u2022\u2022" \\
  -d type=order.created \\
  -d endpoint=ep_7f3a \\
  -d 'payload={"id":"ord_1042","total":8450}'`,node:`import Relay from '@relay/sdk';

const relay = new Relay(process.env.RELAY_KEY);

await relay.events.send({
  type: 'order.created',
  endpoint: 'ep_7f3a',
  payload: { id: 'ord_1042', total: 8450 },
});`,python:`from relay import Relay

relay = Relay(os.environ["RELAY_KEY"])

relay.events.send(
    type="order.created",
    endpoint="ep_7f3a",
    payload={"id": "ord_1042", "total": 8450},
)`};var y=[`northwind`,`contoso`,`fabrikam`,`tailspin`,`litware`,`proseware`];var m=[{icon:`repeat-outline`,title:`Retries that back off, then give up gracefully`,text:`Failed deliveries retry on an exponential schedule for up to three days. Every attempt is logged with its response, and a dead-letter queue keeps what never arrived.`,wide:!0},{icon:`shield-outline`,title:`Signed payloads`,text:`Every request carries an HMAC signature and a timestamp, so receivers verify both the sender and the freshness.`},{icon:`flash-outline`,title:`Under 50 ms to dispatch`,text:`Events leave the queue in milliseconds, from three regions, with ordering kept per endpoint.`},{icon:`activity-outline`,title:`See every attempt`,text:`Request, response, latency and the retry schedule, searchable for 30 days.`},{icon:`code-outline`,title:`SDKs for six languages`,text:`Typed clients for Node, Python, Go, Ruby, Java and .NET, generated from one OpenAPI spec.`},{icon:`globe-outline`,title:`Endpoints your customers manage`,text:`Embed the portal and let customers add endpoints, rotate secrets and replay events themselves.`}];var g=[{title:`Create an endpoint`,text:`Register the URL that should receive events, in the console or with one API call.`},{title:`Send events`,text:`Post a typed event with a JSON payload. Relay queues it, signs it and delivers it in order.`},{title:`Watch it arrive`,text:`Follow every attempt in the log, set alerts on failures, and replay anything from the last 30 days.`}];var h=[{value:`2.4B`,label:`events delivered`},{value:`99.99%`,label:`uptime, last 12 months`},{value:`38 ms`,label:`median dispatch`},{value:`3`,label:`regions`}];var v=[{key:`free`,name:`Free`,description:`For side projects and trying it out.`,monthly:0,yearly:0,events:`10,000 events a month`,features:[`2 endpoints`,`3 days of logs`,`Community support`],action:`Start free`},{key:`pro`,name:`Pro`,description:`For products in production.`,monthly:49,yearly:39,events:`1 million events a month`,features:[`Unlimited endpoints`,`30 days of logs`,`Replays and alerts`,`Email support`],highlighted:!0,action:`Start a trial`},{key:`scale`,name:`Scale`,description:`For platforms with customers of their own.`,monthly:249,yearly:199,events:`20 million events a month`,features:[`Everything in Pro`,`Embedded customer portal`,`SSO and audit log`,`99.99% SLA, priority support`],action:`Talk to sales`}];var f=[{feature:`Events a month`,free:`10,000`,pro:`1 million`,scale:`20 million`},{feature:`Endpoints`,free:`2`,pro:`Unlimited`,scale:`Unlimited`},{feature:`Log retention`,free:`3 days`,pro:`30 days`,scale:`30 days`},{feature:`Retries`,free:!0,pro:!0,scale:!0},{feature:`Replays`,free:!1,pro:!0,scale:!0},{feature:`Alerts`,free:!1,pro:!0,scale:!0},{feature:`Customer portal`,free:!1,pro:!1,scale:!0},{feature:`SSO and audit log`,free:!1,pro:!1,scale:!0},{feature:`SLA`,free:!1,pro:!1,scale:`99.99%`}];var S=[{question:`What counts as an event?`,answer:`One event is one message you send us, however many endpoints it goes to and however many times we retry it. Replays count as new events.`},{question:`What happens when I go over my plan?`,answer:`We keep delivering. You get an email at 80% and 100%, and the next month's invoice adds the overage at the plan's per-event rate.`},{question:`Can I move between plans?`,answer:`Any time. Upgrades apply at once; downgrades apply from the next billing period, and your logs stay as long as the longer retention lasts.`},{question:`Where are events stored?`,answer:`In the region you pick for each endpoint: EU West, US East or Asia Pacific. Logs never leave it.`}];var E=[{title:`Deliveries, 24 h`,value:`184,302`,change:6.4,against:`yesterday`},{title:`Success rate`,value:`99.72%`,change:.08,against:`last week`},{title:`p95 latency`,value:`412 ms`,change:-11.2,against:`last week`},{title:`Retries`,value:`1,318`,change:24.5,against:`yesterday`}];var w=[`00`,`02`,`04`,`06`,`08`,`10`,`12`,`14`,`16`,`18`,`20`,`22`];var R=[4100,2900,2300,3800,8900,12400,13900,14800,15200,11600,8700,6200];var b=[12,9,7,14,41,58,73,66,240,48,31,19];var x={delivered:`success`,failed:`danger`,pending:`warning`};var o=[{id:`ep_7f3a`,url:`https://api.acme.com/hooks/relay`,region:`EU West`,successRate:99.9},{id:`ep_c21d`,url:`https://billing.acme.com/events`,region:`EU West`,successRate:99.4},{id:`ep_90be`,url:`https://warehouse.acme.io/in`,region:`US East`,successRate:97.1},{id:`ep_41aa`,url:`https://staging.acme.com/hooks`,region:`US East`,successRate:92.8}];var l=[`order.created`,`order.paid`,`invoice.sent`,`invoice.paid`,`customer.updated`,`shipment.dispatched`,`refund.issued`];var c={delivered:`HTTP/1.1 200 OK
content-type: application/json
x-request-id: req_9c2e1b

{"received":true}`,failed:`HTTP/1.1 503 Service Unavailable
content-type: text/plain
retry-after: 30

upstream connect error or disconnect/reset before headers`,pending:`Queued: next attempt in 4 min (attempt 3 of 8)`};var _=Array.from({length:48},(a,e)=>{let t=e%11===4?`failed`:e%17===9?`pending`:`delivered`,d=o[e*7%o.length],r=l[e*5%l.length],n=/* @__PURE__ */ new Date(Date.UTC(2026,5,17,16,42,7)-e*7*6e4-e%5*11e3),s=t===`delivered`?180+e*37%420:t===`failed`?8e3+e%3*2e3:0,p=t===`delivered`?[{at:`0 s`,status:200,latency:s}]:t===`failed`?[{at:`0 s`,status:503,latency:10002},{at:`30 s`,status:503,latency:10001},{at:`2 min`,status:502,latency:1204}]:[{at:`0 s`,status:429,latency:311},{at:`30 s`,status:429,latency:298}],i=`evt_${(238064+e*2713).toString(16)}`;return{id:i,type:r,endpoint:d.id,status:t,attempts:p,latency:s,at:n,payload:JSON.stringify({id:i,type:r,created:n.toISOString(),data:{id:`ord_${1042+e}`,customer:`cus_4b19`,total:8450-e*115,currency:`USD`}},null,2),response:c[t]}});var A=[{id:`key_1`,name:`Production API`,prefix:`rl_live_8f2a`,environment:`live`,created:new Date(2026,1,3),lastUsed:new Date(2026,5,17,16,40)},{id:`key_2`,name:`Billing service`,prefix:`rl_live_c91d`,environment:`live`,created:new Date(2026,2,21),lastUsed:new Date(2026,5,17,9,12)},{id:`key_3`,name:`CI pipeline`,prefix:`rl_test_02be`,environment:`test`,created:new Date(2026,4,2),lastUsed:new Date(2026,5,16,22,5)},{id:`key_4`,name:`Local development`,prefix:`rl_test_77a0`,environment:`test`,created:new Date(2026,4,28)}];var D=a=>`rl_${a}_${Math.random().toString(36).slice(2,10)}${Math.random().toString(36).slice(2,14)}`;var T=[{title:`Getting started`,pages:[`Quickstart`,`Authentication`,`Endpoints`]},{title:`Events`,pages:[`Sending events`,`Payloads`,`Ordering`,`Retries`]},{title:`Receiving`,pages:[`Verifying signatures`,`Idempotency`,`Replays`]},{title:`Reference`,pages:[`REST API`,`SDKs`,`Errors`]}];var C=`# Verifying signatures

Every request Relay sends carries a signature, so your receiver can be sure the event came from Relay and
hasn't been changed on the way. Verifying takes three steps.

## The headers

| Header | Example | Meaning |
| --- | --- | --- |
| \`relay-id\` | \`evt_3a1f0\` | The event's id, the same on every attempt |
| \`relay-timestamp\` | \`1781541727\` | When this attempt was signed, in Unix seconds |
| \`relay-signature\` | \`v1,bWF\u2026\` | The version and the base64 HMAC of the body |

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
`;export{w as _,R as a,_ as c,g as d,h as f,v as g,u as h,E as i,b as l,o as m,C as n,S as o,m as p,D as r,T as s,A as t,f as u,x as v,y};