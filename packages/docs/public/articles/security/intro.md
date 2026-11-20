# Security

Where `Lyra Auth` _authenticates_ a user, `Lyra Security` _authorizes_ one: it says which roles may do what with which
resources, and lets the app show and hide accordingly.

<div class="note note-warning">
  <div class="note-title">Warning</div>
  <div class="note-body">
    Front-end ACL only improves the user experience; it doesn't secure anything. The same rules must be enforced on the back-end.
  </div>
</div>

---

## What's included

- ACL roles/permissions/resources configuration
- `NbRoleProvider` - tells the current user's role, whatever the authentication
- `NbAccessChecker` - a service that checks whether access is granted
- `*nbIsGranted` - a conditional directive that shows content when access is granted

---

## Related Articles

- Security Module [Installation](extras/security/installation)
