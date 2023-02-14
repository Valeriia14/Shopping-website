import fetch from "node-fetch";
import { chirp } from "@kidztime/utilities";
import { IPGeoCache } from "@kidztime/models";

const API_ENDPOINT = "http://ip-api.com/json/:ip";

type Geolocationresult = {
  city?: string;
  region?: string;
  country?: string;
  label: string;
  ip_address: string;
  status: string;
  raw: any;
};
const UNKNOWN_LABEL = "Unknown";

/**
 * Set the geolocation of requester which has a default of "Unknown"
 * 
 * @param ip_address - string used to retrieve the geolocation
 * 
 * @returns geolocation
 */
export const ipgeolocation = async (ip_address: string) => {
  if (!ip_address) return UNKNOWN_LABEL;
  let cached = await IPGeoCache.findOne({
    where: { ip_address },
  });
  if (!cached) {
    try {
      const result = await retrieve_geolocation(ip_address);
      cached = await IPGeoCache.create({
        ip_address,
        country: result.country,
        region: result.region,
        city: result.city,
        label: result.label,
        raw: JSON.stringify(result.raw),
      });
    } catch (e) {
      chirp(e);
    }
  }

  return cached?.label || UNKNOWN_LABEL;
};

/**
 * Retrieve the geolocation using `ip_address`
 * 
 * @param ip_address - string used to set the url
 * 
 * @returns `ip_address`, `status`, `city`, `region`, `country`, `label` which defaults to "Unknown" & `raw` which is result.json
 */
export const retrieve_geolocation = async (ip_address: string): Promise<Geolocationresult> => {
  const url = API_ENDPOINT.replace(":ip", ip_address);
  const result = await fetch(url);
  const response = await result.json();

  const { status, country, region, city } = response;
  if (status === "success") {
    const locations: string[] = [];
    if (city.length)
      locations.push(city);
    if (region.length && region !== city)
      locations.push(region);
    if (country.length && country !== city)
      locations.push(country);

    const label = !locations.length ? UNKNOWN_LABEL : locations.join(", ");
    return {
      ip_address,
      status, city, region, country,
      label: label,
      raw: response,
    };
  }

  return {
    ip_address,
    status, city, region, country,
    label: UNKNOWN_LABEL,
    raw: response,
  };
};