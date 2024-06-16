export type PageSectionId = "profile" | "my-minted" | "all-minted";
export type SectionType = {
    id: PageSectionId;
    title: string;
}



export const PageSections: Record<PageSectionId, SectionType> = {
    profile: {
        id: "profile",
        title: "Profile",
    },
    "my-minted": {
        id: "my-minted",
        title: "My Minted NFTs",
    },
    "all-minted": {
        id: "all-minted",
        title: "All Minted NFTs",
    },
};