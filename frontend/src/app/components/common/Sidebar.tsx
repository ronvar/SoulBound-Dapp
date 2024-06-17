import React, { useCallback } from "react";
import { Box, Stack, createStyles } from "@mantine/core";
import { PageSectionId, PageSections } from "@/types/pageTypes";
import { useAtom } from "jotai";
import { selectedPageSectionAtom } from "@/atoms/pageAtoms";
import useScreenSize from "@/hooks/useScreenSize";

type StyleProps = {
  showSidebar: boolean;
  isMobile?: boolean;
};

const useStyles = createStyles((theme, props: StyleProps) => ({
  sidebarWrapper: {
    position: props.isMobile ? "relative" : "fixed",
    left: -100,
    top: -50,
    width: 220,
    height: `calc(100vh - ${props.isMobile ? 300 : 0}px)`,
    backgroundColor: "white",
    zIndex: 10,
    padding: `25px 31px`,
    borderRight: `1px solid #E0E0E0`,
    transform: props.isMobile
      ? undefined
      : `translate(${props.showSidebar ? 80 : 0}px, 136px)`,
  },
  sidebarSectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: `6px ${theme.spacing.xs}`,
    color: "black",
    fontSize: theme.fontSizes.lg,
    lineHeight: 1.55,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: `#EEEEEE`,
    },
  },
  selectedLabel: {
    backgroundColor: `#EEEEEE !important`,
  },
}));

const Sidebar = () => {
  const { isMobile } = useScreenSize();
  const { classes } = useStyles({
    showSidebar: !isMobile,
    isMobile,
  });
  const [selectedSection, setSelectedSection] = useAtom(
    selectedPageSectionAtom
  );

  const handleNewSubSectionClicked = useCallback(
    (id: PageSectionId) => {
      setSelectedSection(PageSections[id]);
    },
    [setSelectedSection]
  );

  return (
    <Box className={classes.sidebarWrapper}>
      {Object.values(PageSections).map((userSection) => {
        return (
          <Stack key={userSection.title} className="full-width" spacing={16}>
            <div
              className={`${classes.sidebarSectionLabel} ${
                selectedSection.id === userSection.id
                  ? classes.selectedLabel
                  : ""
              }`}
              onClick={handleNewSubSectionClicked.bind(this, userSection.id)}
            >
              {userSection.title}
            </div>
          </Stack>
        );
      })}
    </Box>
  );
};

export default Sidebar;
