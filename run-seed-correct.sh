#!/bin/bash
export DATABASE_URL="postgresql://nfc:nfc_password_change_me@localhost:5432/nfc_admin"
export DIRECT_URL="postgresql://nfc:nfc_password_change_me@localhost:5432/nfc_admin"
export NEXTAUTH_SECRET="84123f38fcdf45da7904b1a9fcb0c0ff"
export NEXTAUTH_URL="https://chat.nutrifitcoach.com.br"

npm run seed:conversations
