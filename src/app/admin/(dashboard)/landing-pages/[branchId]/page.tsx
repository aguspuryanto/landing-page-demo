import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { LandingPageForm } from '../landing-page-form';
import { saveLandingPage } from '../actions';

export default async function EditLandingPagePage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { landingPage: true },
  });

  if (!branch) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Landing Page — {branch.name}</h1>
        <p className="text-sm text-muted-foreground">
          URL publik:{' '}
          <Link href={`/${branch.slug}`} className="underline" target="_blank">
            /{branch.slug}
          </Link>
        </p>
      </div>
      <LandingPageForm action={saveLandingPage.bind(null, branchId)} defaultValues={branch.landingPage ?? undefined} />
    </div>
  );
}
