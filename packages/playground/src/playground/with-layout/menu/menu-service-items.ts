import { NbMenuItem } from '@liquid-js/lyr-core'

/**
 * Menu items for the menu service example. The example runs in the playground and inside the docs, where examples
 * live under `/example`, so links are built from the prefix the example is served at.
 */
export function menuServiceItems(base: string): NbMenuItem[] {
    return [
        {
            title: 'Home',
            link: `${base}/menu/menu-service.component`,
            icon: 'home-outline',
            home: true
        },
        {
            title: 'User account',
            link: `${base}/menu/menu-service.component/2`,
            icon: 'person-outline'
        },
        {
            title: 'Shop',
            icon: 'shopping-cart-outline',
            expanded: true,
            children: [
                {
                    title: 'Services',
                    link: `${base}/menu/menu-service.component/3/1`,
                    icon: 'settings-outline'
                },
                {
                    title: 'Hardware',
                    link: `${base}/menu/menu-service.component/3/2`,
                    icon: 'bulb-outline'
                },
                {
                    title: 'Software',
                    icon: 'grid-outline',
                    expanded: true,
                    children: [
                        {
                            title: 'Open Source',
                            link: `${base}/menu/menu-service.component/3/3/1`,
                            icon: 'grid-outline'
                        },
                        {
                            title: 'Commercial',
                            link: `${base}/menu/menu-service.component/3/3/2`,
                            icon: 'grid-outline',
                            queryParams: { param: 2 },
                            fragment: 'fragment'
                        }
                    ]
                }
            ]
        }
    ]
}
