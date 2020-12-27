#!/usr/bin/env sh

rm -rf prisma/archive.db
touch prisma/archive.db
prisma db push --preview-feature
