'use server';

type GeoLocation = {
  countryCode: string;
  source: string;
};

// Strategy 1: CloudFlare Headers
async function getLocationFromHeaders(headers: Headers): Promise<GeoLocation | null> {
  const countryCode = headers.get('cf-ipcountry');
  if (countryCode) {
    return { countryCode, source: 'cloudflare' };
  }
  return null;
}

// Strategy 2: IP-API
async function getLocationFromIpApi(): Promise<GeoLocation | null> {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=countryCode', { next: { revalidate: 3600 } });
    const data = await response.json();
    if (data.countryCode) {
      return { countryCode: data.countryCode, source: 'ip-api' };
    }
  } catch (error) {
    console.error('IP-API Error:', error);
  }
  return null;
}

// Strategy 3: IPinfo.io (requires API key)
async function getLocationFromIpInfo(): Promise<GeoLocation | null> {
  const API_KEY = process.env.IPINFO_API_KEY;
  if (!API_KEY) return null;

  try {
    const response = await fetch(`https://ipinfo.io/json?token=${API_KEY}`, { next: { revalidate: 3600 } });
    const data = await response.json();
    if (data.country) {
      return { countryCode: data.country, source: 'ipinfo' };
    }
  } catch (error) {
    console.error('IPinfo Error:', error);
  }
  return null;
}

export async function detectUserLocation(headers: Headers): Promise<GeoLocation> {
  // Try each strategy in order until one works
  const location = 
    await getLocationFromHeaders(headers) ||
    await getLocationFromIpApi() ||
    await getLocationFromIpInfo();

  // Default to US if all strategies fail
  return location || { countryCode: 'US', source: 'default' };
} 