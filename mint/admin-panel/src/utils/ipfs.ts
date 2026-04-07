import { PINATA_GATEWAY } from '../constants';

export const resolveIpfs = (url: string | null | undefined) => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Return immediately if it's already a full URL or Base64 data
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }

  // Clean the CID: remove ipfs:// and any leading /ipfs/ or ipfs/
  const cid = url.replace('ipfs://', '').replace(/^\/?ipfs\//, '');
  const base = PINATA_GATEWAY.trim().replace(/\/+$/, '');
  
  return base.toLowerCase().endsWith('/ipfs') 
    ? `${base}/${cid}` 
    : `${base}/ipfs/${cid}`;
};
