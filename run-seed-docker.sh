#!/bin/bash
export DATABASE_URL="postgresql://nfc:nfc_password_change_me@localhost:5432/nfc_admin"
export DIRECT_URL="postgresql://nfc:nfc_password_change_me@localhost:5432/nfc_admin"
npm run seed:conversations
