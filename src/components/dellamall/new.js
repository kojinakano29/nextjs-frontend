import styles from '@/styles/dellamall/components/new.module.scss'
import Link from 'next/link';
import Container from './Layouts/container';

const NewBtn = () => {
  return (
    <section className={styles.new}>
      <Container small>
        <h2 className="ttl1 center mb40">新規のお客様はこちら</h2>
        <div className={styles.login__newList}>
          <Link href="/dellamall/officialRequest">
            <a className={`${styles.login__newItem} btn4 hoverEffect`}>公式ショップ申請の方</a>
          </Link>
          <Link href="/dellamall/contact/?type=captcha">
            <a className={`${styles.login__newItem} btn4 hoverEffect`}>
              無料キャプチャ申請の方
              <span>※ショップオーナー様</span>
            </a>
          </Link>
          <Link href="/register">
            <a className={`${styles.login__newItem} btn4 hoverEffect`}>個人利用の方</a>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default NewBtn;