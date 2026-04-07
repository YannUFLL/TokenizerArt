import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  custom, 
  type Address, 
  type Hash 
} from 'viem';
import { sepolia } from 'viem/chains';
import { CONTRACT_ADDRESS, INFURA_URL, MINT_ABI } from '../constants';
import { resolveIpfs } from '../utils/ipfs';

export const getPublicClient = () => {
  return createPublicClient({
    chain: sepolia,
    transport: http(INFURA_URL || undefined)
  });
};

export const getWalletClient = (account: Address) => {
  return createWalletClient({
    account,
    chain: sepolia,
    transport: custom(window.ethereum!)
  });
};

export const fetchNextTokenId = async (): Promise<bigint> => {
  try {
    const publicClient = getPublicClient();
    const id = await (publicClient as any).readContract({
      address: CONTRACT_ADDRESS,
      abi: MINT_ABI,
      functionName: 'nextTokenId',
    });
    return id as bigint;
  } catch (e) {
    console.error("Failed to fetch nextTokenId", e);
    return 0n;
  }
};

export const fetchMintHistory = async () => {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') return [];
  
  try {
    const publicClient = getPublicClient();

    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS,
      event: MINT_ABI.find(x => x.name === 'Transfer' && x.type === 'event') as any,
      args: {
        from: '0x0000000000000000000000000000000000000000'
      },
      fromBlock: 0n,
      toBlock: 'latest'
    });

    const assets = await Promise.all(logs.map(async (log: any) => {
      const tokenId = log.args.tokenId;
      try {
        const uri = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'tokenURI',
          args: [tokenId]
        }) as string;

        let metadata = { name: `Twingo #${tokenId}`, image: '' };
        
        const metadataUrl = resolveIpfs(uri);
        if (metadataUrl && metadataUrl.startsWith('http')) {
          const response = await fetch(metadataUrl);
          if (response.ok) {
            metadata = await response.json();
          }
        }

        return {
          id: tokenId.toString(),
          name: metadata.name || `Twingo #${tokenId}`,
          image: metadata.image ? resolveIpfs(metadata.image) : null,
          owner: log.args.to,
          timestamp: Date.now(),
        };
      } catch (e) {
        return { id: tokenId.toString(), name: `Twingo #${tokenId}`, image: null, owner: log.args.to, timestamp: Date.now() };
      }
    }));

    return assets.reverse();
  } catch (e) {
    console.error("Failed to fetch history", e);
    return [];
  }
};

export const switchChain = async (walletClient: any) => {
  try {
    await walletClient.switchChain({ id: sepolia.id });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await walletClient.addChain({ chain: sepolia });
    } else {
      throw switchError;
    }
  }
};
