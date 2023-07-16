/**
 * Only gets one level up from hostname
 * wwww.example.com -> example.com
 * www.example.co.uk -> example.co.uk
 */
export declare function getTopLevelDomain(host: string): string;
