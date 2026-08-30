import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import styles from './page.module.css';

async function getPublishedLandingPage(slug: string) {
  const branch = await prisma.branch.findUnique({
    where: { slug },
    include: { landingPage: true },
  });

  if (!branch?.landingPage?.published) {
    return null;
  }

  return { branch, landingPage: branch.landingPage };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cabang: string }>;
}): Promise<Metadata> {
  const { cabang } = await params;
  const data = await getPublishedLandingPage(cabang);

  if (!data) {
    return {};
  }

  const { landingPage } = data;

  return {
    title: landingPage.seoTitle || landingPage.heroTitle,
    description: landingPage.seoDescription || landingPage.heroSubtitle || undefined,
    openGraph: landingPage.ogImage ? { images: [landingPage.ogImage] } : undefined,
  };
}

export default async function BranchLandingPage({
  params,
}: {
  params: Promise<{ cabang: string }>;
}) {
  const { cabang } = await params;
  const data = await getPublishedLandingPage(cabang);

  if (!data) {
    notFound();
  }

  const { branch, landingPage } = data;
  const whatsappLink = branch.phone
    ? `https://wa.me/${branch.phone.replace(/[^0-9]/g, '')}`
    : undefined;

  return (
    <main className={styles.hero}>
      {landingPage.ogImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={landingPage.ogImage} alt={landingPage.heroTitle} className={styles.heroImage} />
      )}
      <h1 className={styles.title}>{landingPage.heroTitle}</h1>
      {landingPage.heroSubtitle && <p className={styles.subtitle}>{landingPage.heroSubtitle}</p>}
      {whatsappLink && (
        <a href={whatsappLink} className={styles.contact} target="_blank" rel="noreferrer">
          Hubungi via WhatsApp
        </a>
      )}
    </main>
  );
}
