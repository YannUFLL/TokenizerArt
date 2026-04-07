import { PINATA_JWT } from '../constants';

export const uploadToPinata = async (blob: Blob, fileName: string) => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured in .env");
  }

  const formData = new FormData();
  formData.append('file', blob);
  
  const metadata = JSON.stringify({
    name: fileName,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData
  });

  if (!res.ok) {
    let errorDetail;
    try {
      const errorData = await res.json();
      errorDetail = JSON.stringify(errorData);
    } catch (e) {
      errorDetail = await res.text();
    }
    throw new Error(`Pinata upload failed (Status ${res.status}): ${errorDetail}`);
  }

  const data = await res.json();
  console.log("Pinata upload successful, CID:", data.IpfsHash);
  
  if (typeof data.IpfsHash !== 'string') {
    console.error("Pinata returned non-string IpfsHash:", data);
    throw new Error("Pinata API returned an invalid response format (IpfsHash is not a string)");
  }
  
  return data.IpfsHash;
};
