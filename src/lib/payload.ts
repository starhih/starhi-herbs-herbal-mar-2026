import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { Payload } from 'payload'

let cachedPayload: Payload | null = null

export const getPayloadClient = async (): Promise<Payload> => {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error('PAYLOAD_SECRET is missing')
    }

    if (cachedPayload) {
        return cachedPayload
    }

    cachedPayload = await getPayload({ config: configPromise })

    return cachedPayload
}
