# UI Components

The Auth module's components:

- `<nb-auth-block></nb-auth-block>` - wrapper with the forms' basic styles, already used by the page components;
- `<nb-register></nb-register>` - registration page;
- `<nb-login></nb-login>` - login page;
- `<nb-logout></nb-logout>` - logout page, shows a "logging out..." message while the logout request is sent;
- `<nb-request-password></nb-request-password>` - request password page;
- `<nb-reset-password></nb-reset-password>` - reset password page.

---

## UI Settings

Besides the strategies, `provideNbAuth` (or `NbAuthModule.forRoot`) takes the forms' settings under `forms`:

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
    }),
  ],
  forms: {},
}),
```

Each form is configured separately. The defaults:

```typescript
export interface NbAuthSocialLink {
  link?: string;
  url?: string;
  target?: string;
  title?: string;
  icon?: string;
}

const socialLinks = new Array<NbAuthSocialLink>();

export const defaultAuthOptions: NbAuthResolvedOptions = {
  strategies: [],
  forms: {
    login: {
      redirectDelay: 500, // delay before redirect after a successful login, while success message is shown to the user
      strategy: 'email',  // strategy name.
      rememberMe: true,   // whether to show or not the `rememberMe` checkbox
      showMessages: {     // show/not show success/error messages
        success: true,
        error: true,
      },
      socialLinks: socialLinks, // social links at the bottom of a page
    },
    register: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      terms: true,
      socialLinks: socialLinks,
    },
    requestPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    resetPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    logout: {
      redirectDelay: 500,
      strategy: 'email',
    },
    validation: {
      password: {
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      email: {
        required: true,
      },
      fullName: {
        required: false,
        minLength: 4,
        maxLength: 50,
      },
    },
  },
};
```

---

## Remove redirect delay

For instance, to redirect at once and hide the success messages:

```typescript
provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
    }),
  ],
  forms: {
    login: {
      redirectDelay: 0,
      showMessages: {
        success: false,
      },
    },
    register: {
      redirectDelay: 0,
      showMessages: {
        success: false,
      },
    },
    requestPassword: {
      redirectDelay: 0,
      showMessages: {
        success: false,
      },
    },
    resetPassword: {
      redirectDelay: 0,
      showMessages: {
        success: false,
      },
    },
    logout: {
      redirectDelay: 0,
    },
  },
}),
```

The repeating part can be a variable:

```typescript
const formSetting: NbAuthDeepPartial<NbAuthFormOptions> = {
  redirectDelay: 0,
  showMessages: {
    success: false,
  },
};

provideNbAuth({
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
    }),
  ],
  forms: {
    login: formSetting,
    register: formSetting,
    requestPassword: formSetting,
    resetPassword: formSetting,
    logout: {
      redirectDelay: 0,
    },
  },
}),
```

The settings are merged over the defaults, so only the changed keys are needed.

---

## Where to next

- Receiving [user token after authentication](extras/auth/getting-user-token)
- [Custom Auth Components](extras/auth/custom-auth-components)
