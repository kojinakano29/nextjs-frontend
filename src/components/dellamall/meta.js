import { siteMeta } from "@/lib/dellamall/constants";
import Head from "next/head";

const {siteTitle, siteLocale, siteType, siteIcon} = siteMeta;

const Meta = () => {
  return (
    <Head>
      <title>{siteTitle}</title>
      <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
      />
    </Head>
  );
}

export default Meta;