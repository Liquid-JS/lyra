import { Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbTagComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { illustration } from '../shared/showcase-images'
import { ShowcaseLogoComponent } from '../shared/showcase-logo.component'
import { ShowcaseLogoName } from '../shared/showcase-logos'
import { SiteMockupComponent } from './site-mockup.component'

interface Plan {
    name: string
    description: string
    monthly: number
    features: string[]
    featured?: boolean
}

/** A product's landing page: what it does, what customers say, what it costs, and questions answered. */
@Component({
    selector: 'npg-site-home',
    templateUrl: './site-home.component.html',
    styleUrls: ['./site-home.component.scss'],
    imports: [
        NbAccordionComponent,
        NbAccordionItemBodyComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbTagComponent,
        NbUserComponent,
        RouterLink,
        ShowcaseLogoComponent,
        SiteMockupComponent
    ]
})
export class SiteHomeComponent {
    readonly customers: Array<{ name: string, logo: ShowcaseLogoName }> = [
        { name: 'Orbit', logo: 'wordmark-orbit' },
        { name: 'Bloom', logo: 'wordmark-bloom' },
        { name: 'Prism', logo: 'wordmark-prism' },
        { name: 'Shift', logo: 'wordmark-shift' },
        { name: 'Script', logo: 'wordmark-script' }
    ]

    readonly features = [
        { icon: 'people-outline', title: 'Every customer in one place', text: 'Contacts, companies, deals and notes, searchable in a moment.' },
        { icon: 'file-text-outline', title: 'Invoices that send themselves', text: 'Recurring invoices, reminders and receipts, in your brand.' },
        { icon: 'pie-chart-outline', title: 'Reports you can read', text: 'Revenue, churn and pipeline at a glance, ready to share.' },
        { icon: 'bell-outline', title: 'Nothing slips through', text: 'Tasks and follow-ups land with the right person, on time.' },
        { icon: 'lock-outline', title: 'Secure by default', text: 'Single sign-on, roles and an audit log on every plan.' },
        { icon: 'flash-outline', title: 'Fits your tools', text: 'Connects to your email, calendar and accounting software.' }
    ]

    readonly stats = [
        { value: '4,000+', label: 'teams' },
        { value: '1.2M', label: 'invoices sent' },
        { value: '99.9%', label: 'uptime' },
        { value: '4.8/5', label: 'average rating' }
    ]

    readonly quotes = [
        { name: 'Emma Brown', avatar: illustration('Emma Brown', 'open-peeps'), role: 'Operations lead, Fabrikam', text: 'We moved three spreadsheets and two tools into Acme in a week. Month-end now takes an afternoon.' },
        { name: 'Noah Davis', avatar: illustration('Noah Davis', 'open-peeps'), role: 'Founder, Proseware', text: 'The reports are the first thing I open every morning. I finally know where our revenue comes from.' },
        { name: 'Sophie Taylor', avatar: illustration('Sophie Taylor', 'open-peeps'), role: 'Account manager, Adventure Works', text: 'Follow-ups used to fall through the cracks. Now the team sees every customer’s history in one place.' }
    ]

    readonly yearly = signal(true)
    readonly plans: Plan[] = [
        { name: 'Starter', description: 'For freelancers getting organised.', monthly: 12, features: ['1 user', '500 contacts', 'Invoices and receipts', 'Email support'] },
        { name: 'Team', description: 'For growing teams that share customers.', monthly: 29, features: ['Up to 10 users', 'Unlimited contacts', 'Reports and dashboards', 'Integrations', 'Priority support'], featured: true },
        { name: 'Business', description: 'For companies with more to manage.', monthly: 59, features: ['Unlimited users', 'Single sign-on', 'Audit log', 'Dedicated manager'] }
    ]
    readonly prices = computed(() =>
        this.plans.map((plan) => (this.yearly() ? Math.round(plan.monthly * 0.8) : plan.monthly))
    )

    readonly questions = [
        { question: 'Can I try Acme before paying?', answer: 'Yes: every plan starts with a 14-day trial, and you don’t need a card to begin.' },
        { question: 'Can I change plans later?', answer: 'Any time. Upgrades apply straight away; downgrades at the end of the billing period.' },
        { question: 'Where is my data stored?', answer: 'In the EU or the US, as you choose, encrypted at rest and in transit.' },
        { question: 'Do you offer discounts for non-profits?', answer: 'Yes, half price on every plan. Get in touch with our team to set it up.' }
    ]

    setBilling(value: unknown) {
        this.yearly.set(value === 'yearly')
    }
}
