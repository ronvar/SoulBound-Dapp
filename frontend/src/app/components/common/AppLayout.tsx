import React, { ReactNode, useState } from "react";
import {
  Anchor,
  AppShell,
  Box,
  Center,
  Container,
  Divider,
  Header,
  Image,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";

const GENERIC_LOGO = "https://cryptologos.cc/logos/polygon-matic-logo.png";

const useStyles = createStyles(() => ({
  genericHeader: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    paddingRight: 80,
    paddingLeft: 20,
  },
}));

const GenericHeader = () => {
  const { classes } = useStyles();

  return (
    <Header height={88} p={"md"}>
      <div className={classes.genericHeader}>
        <Anchor href="/">
          <Image
            src={GENERIC_LOGO}
            height={40}
            width={46}
            alt="logo"
            draggable={false}
          />
        </Anchor>
        <div style={{ width: "10%" }} />
      </div>
    </Header>
  );
};

const Layout = ({
  children,
  headerToolbar,
  sidebar,
  size,
}: {
  children: any;
  headerToolbar?: JSX.Element;
  sidebar?: JSX.Element;
  size: string | number;
  footerToolbar?: any;
  title?: string;
  description?: string;
  image?: string;
}) => {
  const theme = useMantineTheme();
  const [ready, setReady] = useState(false);
  const { classes } = useStyles();

  useShallowEffect(() => {
    setReady(true);
  }, []);

  return (
    <Container
      px={0}
      size={"100%"}
      style={{
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <AppShell
        navbarOffsetBreakpoint={"sm"}
        asideOffsetBreakpoint={"sm"}
        header={ready ? headerToolbar || <GenericHeader /> : undefined}
        navbar={ready ? sidebar : undefined}
        styles={(theme) => ({
          main: {
            maxWidth: `calc(100% - 100px)`,
            minHeight: `calc(100vh - ${headerToolbar ? 72 : 88}px)`,
            paddingLeft: !sidebar ? theme.spacing.md : undefined
          },
          
        })}
      >
        {ready && (
          <Box w={"100%"} maw={"100%"} pl={100} style={{
            position: "relative",
          }}>
            <Center>{children}</Center>
          </Box>
        )}
      </AppShell>
    </Container>
  );
};

export default Layout;
