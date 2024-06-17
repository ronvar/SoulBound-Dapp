import { NftDetails } from "@/types/nft";
import { atom } from "jotai";

export const userMintedNftsAtom = atom<NftDetails[]>([]);
export const allMintedNftsAtom = atom<NftDetails[]>([]);