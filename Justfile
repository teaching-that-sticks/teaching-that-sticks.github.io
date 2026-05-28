# Teaching That Sticks — Justfile
# Run `just` to list available commands.

set shell := ["zsh", "-cu"]

site := "site"

# List available commands (default)
default:
    @just --list

# Install dependencies
install:
    @cd {{site}} && npm install

# Dev server with hot reload
dev:
    @cd {{site}} && npm run dev

# Production build
build:
    @cd {{site}} && npm run build

# Build then preview the production output locally
preview: build
    @cd {{site}} && npm run preview

# Type-check without building
check:
    @cd {{site}} && npm run astro check

# Clean build output
clean:
    @rm -rf {{site}}/dist {{site}}/.astro
