import styles from '@/styles/components/form.module.scss'
import Container from "@/components/Layouts/container";
import PageLayout from "@/components/Layouts/PageLayout";
import { PageTitle } from '@/components';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PresentThanks = () => {
  const router = useRouter()

  useEffect(() => {
    const comp = sessionStorage.getItem('comp')

    if (!comp) {
      router.push(`/present`)
    }

    sessionStorage.removeItem('comp')
  }, [])

  return (
    <section className="cont1">
      <PageTitle title="PRESENT" ivy />
      <Container small900>
        <div className={styles.thanksBox}>
          <p className={styles.txt}>ご応募いただきありがとうございました。</p>
          <Link href="/present">
            <a className="btn3 ivy">back to top</a>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default PresentThanks;

PresentThanks.getLayout = function getLayout(page) {
  return <PageLayout>{page}</PageLayout>
}