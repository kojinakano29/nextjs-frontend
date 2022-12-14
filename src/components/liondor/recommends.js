import styles from '@/styles/liondor/components/recommends.module.scss'
import 'swiper/css/bundle'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper'
import dummy from '@/images/liondor/cms/dummy.png'
import Link from 'next/link'
import { BlogTxt } from '@/components/liondor'

const Recommends = ({posts}) => {
  const pickup = posts.pickups

  return (
    <article className={styles.recoBox}>
      <h2 className="ttl1 ivy">RECOMMENDS</h2>
      <div className={styles.slideWrap}>
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={34}
          slidesPerView="auto"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          loop={true}
        >
          {pickup.map((item, index) => (
            <SwiperSlide key={index}>
              <div className={styles.slideBox}>
                <Link href={`/liondor/post/show/${item.id}`}>
                  <a className={styles.blogLink}>
                    <div className={styles.imgBox}>
                      <img src={item.l_post.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.l_post.thumbs}` : dummy.src} alt="" />
                    </div>
                    <BlogTxt
                      cat={item.l_post.l_category?.parent_slug?.toUpperCase()}
                      cat2={item.l_post.l_category?.name}
                      ttl={item.l_post.title}
                      name={item.l_post.user.l_profile.nicename}
                      time={item.l_post.view_date}
                      smallMb
                    />
                  </a>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.slideNav}>
        <button className={`swiper-button-prev ${styles.prev}`}></button>
        <button className={`swiper-button-next ${styles.next}`}></button>
      </div>
    </article>
  );
}

export default Recommends;