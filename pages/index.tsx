import { useEffect } from "react";
import { fetchConfig, readLocalConfig } from "../lib/utils";
import { Config } from "../types/config";

// Components
import Head from "next/head";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Paper from "../components/Paper";
import Title from "../components/Title";
import PaperBody from "../components/PaperBody";
import LinksList from "../components/LinksList";
import Logo from "../components/Logo";

// Types
import { Block } from "../types/block";

// Google Tag manager
import TagManager, { TagManagerArgs } from "react-gtm-module";

const tagManagerArgs: TagManagerArgs = {
  gtmId: "GTM-WZGV6DS",
};
interface HomeProps {
  config: Config;
  error?: string | null;
}

export default function Home({ config, error }: HomeProps) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  });

  const { blocks, html, main } = config;
  return (
    <div>
      <Head>
        <title>{html?.title}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container>
        <Paper>
          <Logo title={main.title} />
          <Title>{main?.title}</Title>
          <div className='divide-y divide-gray-300/50'>
            <PaperBody>
              <LinksList links={blocks as Block[]} />
            </PaperBody>
            <Footer>
              <p className='text-slate-400'>Copialo GRATIS!</p>
            </Footer>
            <div>{error && error}</div>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  let config: Config = await readLocalConfig();
  let error = null;
  if (process.env.DOMAIN_MATCH) {
    try {
      const hostname = context.req.headers.host.split(".");
      const subdomain = hostname.shift();
      const domain = hostname.join(".");
      if (domain !== process.env.DOMAIN_MATCH) {
        throw new Error("Invalid DOMAIN_MATCH in .env");
      }
      const url = `https://raw.githubusercontent.com/${subdomain}/.lacrypta/main/config.yml`;

      config = await fetchConfig(url);
    } catch (e: any) {
      console.warn("Invalid username or subdomain: " + e.message);
      error = e.message;
    }
  }

  return {
    props: { config, error },
  };
}
