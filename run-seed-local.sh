#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nutrifitcoach"
export DIRECT_URL="postgresql://postgres:postgres@localhost:5432/nutrifitcoach"
export NEXTAUTH_SECRET="84123f38fcdf45da7904b1a9fcb0c0ff"
export NEXTAUTH_URL="https://chat.nutrifitcoach.com.br"

npm run seed:conversations
