import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { Payload } from 'payload'

// Use globalThis to persist the payload promise across Next.js HMR (Hot Module Replacement) cycles
const globalWithPayload = globalThis as unknown as {
    payloadPromise: Promise<Payload> | null
}

export const getPayloadClient = async (): Promise<Payload> => {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error('PAYLOAD_SECRET is missing')
    }

    if (!globalWithPayload.payloadPromise) {
        globalWithPayload.payloadPromise = getPayload({ config: configPromise })
    }

    return globalWithPayload.payloadPromise
}
