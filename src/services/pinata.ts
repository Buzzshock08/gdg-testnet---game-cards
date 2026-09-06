import { NFTMetadata } from '../types/card';

// Pinata Modern V3 Uploads API (compatible with modern and scoped JWTs)
const PINATA_V3_UPLOAD_URL = 'https://uploads.pinata.cloud/v3/files';
// Legacy Pinning API endpoint (for backward-compatible pinning fallback)
const PINATA_LEGACY_API_URL = 'https://api.pinata.cloud/pinning';

/**
 * Returns normalized base gateway URL (ensures proper /ipfs suffix)
 */
export function getGatewayBase(): string {
  let gw = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
  gw = gw.trim().replace(/\/+$/, '');
  if (!gw.endsWith('/ipfs')) {
    gw = `${gw}/ipfs`;
  }
  return gw;
}

const DEFAULT_GATEWAY = getGatewayBase();

/**
 * Get active Pinata JWT from environment or local storage override
 */
export function getPinataJWT(): string {
  return (
    localStorage.getItem('dcard_pinata_jwt') ||
    import.meta.env.VITE_PINATA_JWT ||
    ''
  );
}

/**
 * Save user custom Pinata JWT to local storage
 */
export function setPinataJWT(jwt: string): void {
  if (jwt.trim()) {
    localStorage.setItem('dcard_pinata_jwt', jwt.trim());
  } else {
    localStorage.removeItem('dcard_pinata_jwt');
  }
}

/**
 * Resolves an ipfs:// or gateway URL to an accessible HTTP gateway URL
 */
export function resolveIPFSUrl(uri: string): string {
  if (!uri) return '';
  const gateway = getGatewayBase();
  if (uri.startsWith('ipfs://')) {
    const cidPath = uri.replace('ipfs://', '');
    return `${gateway}/${cidPath}`;
  }
  if (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('data:')) {
    return uri;
  }
  return `${gateway}/${uri}`;
}

/**
 * Uploads an image File/Blob to Pinata IPFS using the modern v3 uploads endpoint
 * with fallback to legacy endpoint if required.
 * @returns IPFS URI (e.g. ipfs://bafk...) and HTTP gateway URL
 */
export async function uploadImageToPinata(
  file: File | Blob,
  fileName: string = 'card-image.png'
): Promise<{ ipfsUri: string; cid: string; gatewayUrl: string }> {
  const jwt = getPinataJWT();
  const gateway = getGatewayBase();

  if (jwt) {
    // 1. Try modern Pinata v3 uploads endpoint (supported by scoped API keys)
    try {
      const v3FormData = new FormData();
      v3FormData.append('file', file, fileName);
      v3FormData.append('name', fileName);
      v3FormData.append('network', 'public');

      const v3Response = await fetch(PINATA_V3_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: v3FormData,
      });

      if (v3Response.ok) {
        const result = await v3Response.json();
        const cid = result.data?.cid || result.data?.IpfsHash || result.cid;
        if (cid) {
          return {
            cid,
            ipfsUri: `ipfs://${cid}`,
            gatewayUrl: `${gateway}/${cid}`,
          };
        }
      } else {
        const errorText = await v3Response.text();
        console.warn('Pinata v3 file upload unsuccessful, attempting legacy endpoint:', errorText);
      }
    } catch (v3Error) {
      console.warn('Pinata v3 file upload error, attempting legacy endpoint:', v3Error);
    }

    // 2. Legacy fallback to /pinning/pinFileToIPFS for full-admin legacy keys
    const legacyFormData = new FormData();
    legacyFormData.append('file', file, fileName);

    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        type: 'game-card-image',
        platform: 'dcard-marketplace',
      },
    });
    legacyFormData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    legacyFormData.append('pinataOptions', options);

    const legacyResponse = await fetch(`${PINATA_LEGACY_API_URL}/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: legacyFormData,
    });

    if (!legacyResponse.ok) {
      const errText = await legacyResponse.text();
      throw new Error(`Pinata image upload failed (${legacyResponse.status}): ${errText}`);
    }

    const data = await legacyResponse.json();
    const cid = data.IpfsHash;
    return {
      cid,
      ipfsUri: `ipfs://${cid}`,
      gatewayUrl: `${gateway}/${cid}`,
    };
  }

  // Fallback: Generate an authentic SHA-256 IPFS Content-ID simulation with base64/blob storage
  // so the app remains 100% testable even without an active Pinata subscription
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const simulatedCid = `bafkrei${hexHash.substring(0, 46)}`;

  // Compress before storing — raw uploaded photos can be several MB, which
  // alone can exceed the browser's total localStorage quota (~5-10MB) once
  // the card carrying this data URL gets persisted.
  const dataUrl = await compressImageForLocalStorage(file);
  try {
    sessionStorage.setItem(`ipfs_cache_${simulatedCid}`, dataUrl);
  } catch (e) {
    // Ignore storage limit
  }

  return {
    cid: simulatedCid,
    ipfsUri: `ipfs://${simulatedCid}`,
    gatewayUrl: dataUrl,
  };
}

/**
 * Uploads NFT Metadata JSON to Pinata IPFS using the modern v3 uploads endpoint
 * with fallback to legacy pinJSONToIPFS if required.
 * @returns IPFS URI (e.g. ipfs://bafk...) and HTTP gateway URL
 */
export async function uploadMetadataToPinata(
  metadata: NFTMetadata,
  cardName: string
): Promise<{ ipfsUri: string; cid: string; gatewayUrl: string }> {
  const jwt = getPinataJWT();
  const gateway = getGatewayBase();
  const fileName = `${cardName.replace(/\s+/g, '-').toLowerCase()}-metadata.json`;

  if (jwt) {
    // 1. Try modern Pinata v3 uploads endpoint (supported by scoped API keys)
    try {
      const jsonString = JSON.stringify(metadata, null, 2);
      const jsonBlob = new Blob([jsonString], { type: 'application/json' });
      const v3FormData = new FormData();
      v3FormData.append('file', jsonBlob, fileName);
      v3FormData.append('name', fileName);
      v3FormData.append('network', 'public');

      const v3Response = await fetch(PINATA_V3_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: v3FormData,
      });

      if (v3Response.ok) {
        const result = await v3Response.json();
        const cid = result.data?.cid || result.data?.IpfsHash || result.cid;
        if (cid) {
          return {
            cid,
            ipfsUri: `ipfs://${cid}`,
            gatewayUrl: `${gateway}/${cid}`,
          };
        }
      } else {
        const errorText = await v3Response.text();
        console.warn('Pinata v3 metadata upload unsuccessful, attempting legacy endpoint:', errorText);
      }
    } catch (v3Error) {
      console.warn('Pinata v3 metadata upload error, attempting legacy endpoint:', v3Error);
    }

    // 2. Legacy fallback to /pinning/pinJSONToIPFS for full-admin legacy keys
    const payload = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: fileName,
        keyvalues: {
          type: 'game-card-metadata',
          platform: 'dcard-marketplace',
        },
      },
      pinataContent: metadata,
    };

    const legacyResponse = await fetch(`${PINATA_LEGACY_API_URL}/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!legacyResponse.ok) {
      const errText = await legacyResponse.text();
      throw new Error(`Pinata metadata upload failed (${legacyResponse.status}): ${errText}`);
    }

    const data = await legacyResponse.json();
    const cid = data.IpfsHash;
    return {
      cid,
      ipfsUri: `ipfs://${cid}`,
      gatewayUrl: `${gateway}/${cid}`,
    };
  }

  // Fallback: Generate cryptographic CID for metadata
  const jsonString = JSON.stringify(metadata, null, 2);
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(jsonString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const simulatedCid = `bafkreib${hexHash.substring(0, 45)}`;

  try {
    sessionStorage.setItem(`ipfs_meta_${simulatedCid}`, jsonString);
  } catch (e) {
    // Ignore storage limit
  }

  return {
    cid: simulatedCid,
    ipfsUri: `ipfs://${simulatedCid}`,
    gatewayUrl: `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`,
  };
}

/**
 * Helper to convert a file/blob to data URL
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Downscales and re-encodes an image to keep its data URL small enough to
 * safely fit in localStorage (used only for the simulated/no-JWT fallback
 * path below — real Pinata uploads never touch localStorage). Without this,
 * a normal 3-8MB phone photo can single-handedly exceed the browser's
 * ~5-10MB total localStorage quota and silently break minting.
 */
async function compressImageForLocalStorage(
  file: File | Blob,
  maxDimension: number = 900,
  quality: number = 0.82
): Promise<string> {
  // SVGs are already tiny, vector-based text — skip compression entirely.
  if (file instanceof File && file.type === 'image/svg+xml') {
    return fileToDataUrl(file);
  }

  const dataUrl = await fileToDataUrl(file);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Canvas unavailable for some reason — fall back to the original
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fall back to original on decode failure
    img.src = dataUrl;
  });
}
