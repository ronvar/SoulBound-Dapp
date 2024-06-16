import { PageSections, SectionType } from "@/types/pageTypes";
import { atom } from "jotai";

export const selectedPageSectionAtom = atom<SectionType>(PageSections.profile);