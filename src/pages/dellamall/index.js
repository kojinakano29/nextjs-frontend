import { Btn01, Loader, MasonryGridComponent, PopularStore, Trend } from '@/components/dellamall';
import Container from '@/components/dellamall/Layouts/container';
import PageLayoutDellamall from '@/components/Layouts/PageLayoutDellamall';
import styles from '@/styles/dellamall/components/home.module.scss'
import fv_text from '@/images/dellamall/top/fv_text.svg'
import Image from 'next/image';
import { faTrophy, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { createContext, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import useSWRInfinite from "swr/infinite"
import Link from 'next/link';

export const StoreData = createContext()

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_DELLAMALL}`)
  const data = await res.json()

  return {
      props: {
          posts: data
      }
  }
}

const Home = ({posts}) => {
  // console.log(posts)
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  /* 二度押し監視 */
  const processing = useRef(false)

  const popular = posts.popular
  const pickups = posts.pick
  const pickupLimit = pickups.filter((p, index) => {
    return index < 8
  })
  const pickup = pickupLimit.map((pick) => {
    return pick.d_shop
  })

  /* もっと見る useSWRInfinite */
  const limit = 28;
  const getKey = (pageIndex, previousPageData) => {
    csrf()
    if (previousPageData && !previousPageData.length) return null
    if (pageIndex === 0) return '/api/dellamall/more/1'
    return `/api/dellamall/more/${pageIndex+1}?limit=${limit}`
  }

  const fetcher = url => axios.post(url).then(res => res.data.add_page)

  const {
    data,
    error,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher)

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data?.[data?.length - 1]?.length < limit)
  if (error) return "failed"
  const pics = data?.flat()

  const handleClickMore = async () => {
    if (processing.current) return
    processing.current = true
    await setSize(size + 1)
  }

  useEffect(() => {
    processing.current = false
  }, [handleClickMore])
  /* もっと見る useSWRInfinite */

  return (
    <>
      <section className={styles.mv}>
        <Container small>
          <h1 className={styles.sitename}>
            <Image
              src={fv_text}
              alt="della mall"
              layout="responsive"
              sizes="416px"
              priority
            />
          </h1>
          <div className={styles.mvTxtBox}>
            <p className={styles.sm}>日本中の素敵なECサイトを集めた<br className="sp" />新世代マーケットでお買い物！</p>
            <p className={`${styles.big} en`}><span>Slogan is</span> Everyone,<br className="sp" />Find,Share,Enjoy</p>
          </div>
        </Container>
        <div className={styles.trend}>
          <Container small>
            <Trend sp />
          </Container>
        </div>
      </section>

      <section className={styles.popular}>
        <Container small>
          <h2 className="ttl1">人気のストア</h2>
        </Container>
        <div className={styles.popularWrap}>
          <StoreData.Provider value={{popular}}>
            <PopularStore />
          </StoreData.Provider>
        </div>
        <Container>
          <Btn01 fa={faTrophy} txt="ランキングを見る" link="/dellamall/shop" right />
        </Container>
      </section>

      <section className={styles.pickup}>
        <Container>
          <h2 className="ttl1">PICKUP</h2>
          <MasonryGridComponent item={pickup} none />
        </Container>
      </section>

      <section className={styles.storeList}>
        <Container>
          <h2 className="ttl1">ストア一覧</h2>
          <MasonryGridComponent item={pics} />
          {!data ? <Loader /> : null}
          {processing.current ? <Loader /> : null}
          {data && !isReachingEnd && !processing.current ?
            <div className="btnCover" onClick={handleClickMore}>
              <Btn01 fa={faSquarePlus} txt="さらに見る" />
            </div>
          : null}
        </Container>
      </section>

      <Container small>
        <Link href="/corapura/press_release">
          <a className={styles.banner}>
            <img src="" alt="" />
          </a>
        </Link>
      </Container>
    </>
  );
}

export default Home;

Home.getLayout = function getLayout(page) {
  return <PageLayoutDellamall>{page}</PageLayoutDellamall>
}