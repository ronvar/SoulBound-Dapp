// token Id, owner address, time minted and transaction hash
export type MintedNft = {
    contractAddress: string,
    name: string,
    nftId: string,
    imageUrl: string,
    transactionHash: string,
    timeMinted: number,
    ownerAddress: string,
}