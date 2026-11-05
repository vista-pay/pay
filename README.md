# Rendi Pay

Isolated, unauthenticated checkout for personal, business, and community payment links.

## Public routes

- `/{hash}` — pay a payment link
- `/i/{hash}` — view and download an invoice
- `/complete` — payment-provider return page
- `/pay/{hash}` — backwards-compatible redirect to `/{hash}`

## Production configuration

```env
NEXT_PUBLIC_API_BASE=https://api.rendi.ng/api/v1
NEXT_PUBLIC_PAYMENT_BASE_URL=https://pay.rendi.ng
```

The backend must use matching values:

```env
PAYMENT_LINK_BASE_URL=https://pay.rendi.ng
PAYSTACK_CALLBACK_URL=https://pay.rendi.ng/complete
```

Add `https://pay.rendi.ng` to the backend `CORS_ORIGINS` allowlist.
