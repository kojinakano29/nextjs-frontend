import styles from '@/styles/dellamall/components/footer.module.scss'
import Container from '@/components/dellamall/Layouts/container';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/dellamall/parts/footer/footer__logo.svg'
import bolides from '@/images/dellamall/parts/footer/bolides.svg'
import marchedor from '@/images/dellamall/parts/footer/marchedor.svg'
import corapura from '@/images/dellamall/parts/footer/corapura.svg'
import liondor from '@/images/dellamall/parts/footer/liondor.svg'
import top from '@/images/dellamall/parts/common/to-top.svg'
import { animateScroll as scroll } from "react-scroll";
import { useCallback, useEffect, useState } from 'react';

const Footer = () => {
  const scrollTop = useCallback(() => {
    scroll.scrollToTop()
  }, [])

  const [show, setShow] = useState(false)

  const handleScroll = useCallback(() => {
    const nowPos = window.scrollY

    if (nowPos > 500) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <button
        className={`
          ${styles.topBtn}
          ${show ? styles.active : ""}
          hoverEffect
        `}
        onClick={scrollTop}
      >
        <Image
          src={top}
          alt=""
          layout="responsive"
          sizes="56px"
          priority
        />
      </button>
      <footer className={styles.footer}>
        <Container small>
          <Link href="/dellamall">
            <a className={`${styles.logo} hoverEffect`}>
              <Image
                src={logo}
                alt="della mall"
                layout="responsive"
                sizes="144px"
                priority
              />
            </a>
          </Link>
          <div className={styles.footer__listPage}>
            <a className="hoverEffect" href="https://bolides.co.jp/company/" target="_blank" rel="noopener noreferrer">????????????</a>
            <Link href="/dellamall/terms">
              <a className="hoverEffect">????????????</a>
            </Link>
            <Link href="/dellamall/privacy">
              <a className="hoverEffect">??????????????????????????????</a>
            </Link>
            <Link href="/corapura/press_release">
              <a className="hoverEffect" target="_blank" rel="noopener noreferrer">?????????????????????</a>
            </Link>
            <Link href="/dellamall/contact">
              <a className="hoverEffect">??????????????????</a>
            </Link>
          </div>
          <div className={styles.footer__listCompany}>
            <a href="https://bolides.co.jp/" className="hoverEffect" target="_blank" rel="noopener noreferrer">
              <Image
                src={bolides}
                alt=""
                layout="responsive"
                sizes="240px"
                priority
              />
            </a>
            <a href="https://marche-dor.jp/" className="hoverEffect" target="_blank" rel="noopener noreferrer">
              <Image
                src={marchedor}
                alt=""
                layout="responsive"
                sizes="240px"
                priority
              />
            </a>
            <a href="/corapura" className="hoverEffect" target="_blank" rel="noopener noreferrer">
              <Image
                src={corapura}
                alt=""
                layout="responsive"
                sizes="240px"
                priority
              />
            </a>
            <a href="/liondor" className="hoverEffect" target="_blank" rel="noopener noreferrer">
              <Image
                src={liondor}
                alt=""
                layout="responsive"
                sizes="240px"
                priority
              />
            </a>
          </div>
          <div className={styles.footer__text}>
            ??????????????????reCAPTHA????????????????????????????????????
            <br />Google???<a href="https://policies.google.com/privacy?hl=ja" target="_blank">??????????????????????????????</a>???<a href="https://policies.google.com/terms?hl=ja" target="_blank">????????????</a>????????????????????????
          </div>
          <p className={`${styles.copy} en`}>?? 2022 Della Moll inc.</p>
        </Container>
      </footer>
    </>
  );
}

export default Footer;