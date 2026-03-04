# Pixel Task Nexus

A light-mode collaborative task management web app with pixel-inspired UI.

## Features

- Role-based login (`admin`, `manager`, `member`)
- Shared task visibility for all users
- Pending task bucket where team members can self-pick tasks
- Manager/admin task creation into bucket
- Collaboration threads (comments) per task
- Manager/admin nudges to specific assignees
- Admin-only user/role management
- Internal multi-point task estimate saved in state and hidden from UI
- Responsive layout and animated interface
- Optional cross-device realtime sync through Firebase Firestore

## Demo Accounts

- `admin` / `admin123`
- `manager` / `manager123`
- `alex` / `alex123`
- `sam` / `sam123`
- `rina` / `rina123`

## Local Mode

With default config, the app runs in local mode using browser storage.

## Enable Cloud Realtime Sync

1. Create a Firebase project and enable Firestore.
2. Copy `firebase-config.example.js` to `firebase-config.js`.
3. Set `cloudSyncEnabled = true` and fill `firebaseConfig` fields.
4. Deploy or reload the app. It will sync task data across devices in realtime.

### Recommended Firestore Rules (demo)

Use stricter production rules for real apps. For quick testing, you can temporarily allow reads/writes:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pixel_task_nexus/{docId} {
      allow read, write: if true;
    }
  }
}
```

