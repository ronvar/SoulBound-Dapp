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
import { useRouter } from "next/router";
import { useShallowEffect } from "@mantine/hooks";

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
            src="/app_logo.png"
            height={40}
            width={46}
            alt="bello logo"
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
  const router = useRouter();
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
            minHeight: `calc(100vh - ${headerToolbar ? 72 : 88}px)`,
            paddingLeft: !sidebar ? theme.spacing.md : undefined
          },
        })}
      >
        {ready && (
          <Container className="position-relative" size={size} px={0}>
            <Center>{children}</Center>
          </Container>
        )}
      </AppShell>
    </Container>
  );
};

export default Layout;
