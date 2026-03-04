
import { getPayloadClient } from '../src/lib/payload';

async function checkCategories() {
    const payload = await getPayloadClient();
    const { totalDocs } = await payload.find({
        collection: 'categories',
        limit: 0,
    });
    console.log(`Total Categories: ${totalDocs}`);
    process.exit(0);
}

checkCategories();
