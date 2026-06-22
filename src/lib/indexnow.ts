/**
 * IndexNow submission utility for automated search engine URL indexing
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  if (!urls || urls.length === 0) return false;

  const payload = {
    host: 'starhiherbs.com',
    key: '19xnegmm1wnfu1uagersrrk5ksxzufya',
    keyLocation: 'https://starhiherbs.com/19xnegmm1wnfu1uagersrrk5ksxzufya.txt',
    urlList: urls,
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[IndexNow] Successfully submitted ${urls.length} URL(s)`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[IndexNow] Submission failed: ${response.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('[IndexNow] Network/Fetch error:', error);
    return false;
  }
}
