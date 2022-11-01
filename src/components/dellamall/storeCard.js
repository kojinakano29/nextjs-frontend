import styles from '@/styles/dellamall/components/storeCard.module.scss'
import dummyDefault from '@/images/dellamall/parts/store__item/defoult.webp'
import dummyShop from '@/images/dellamall/parts/store__item/test@del.png'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const StoreCard = ({item, swiper = false}) => {
    const url = `${item.url.substring(0, 11)}...`

    return (
        <div className={`${styles.item} ${swiper ? styles.swiper : ""}`}>
            <img className={styles.shopImg} src={item.image_permission === 0 ? dummyDefault.src : dummyShop.src} alt="" />
            {item.image_permission === 0 ?
                <div className={`${styles.card} ${styles.default}`}>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.sub}>
                        ショップオーナーHPキャプチャ画像
                        <br/>無料掲載はこちら
                    </p>
                    <div className={styles.flex}>
                        <p className={`${styles.link} en`}>
                            <FontAwesomeIcon icon={faLink} />
                            <span>{url}</span>
                        </p>
                        <div className={styles.flex2}>
                            <div className={styles.box}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faComment} />
                                </button>
                                <p className={`${styles.counter} en`}>{item.d_comments_count}</p>
                            </div>
                            <div className={styles.box}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <p className={`${styles.counter} en`}>{item.d_goods_count}</p>
                            </div>
                            <div className={styles.box}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faBookmark} />
                                </button>
                                <p className={`${styles.counter} en`}>{item.d_shop_bookmarks_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            : null}
            <div className={`${styles.card} ${styles.onMouse}`}>
                <p className={styles.name}>{item.name}</p>
                {item.image_permission === 0 ?
                    <div className={`${styles.btnArea} ${styles.btnArea1}`}>
                        <p>ショップオーナーHPキャプチャ画像</p>
                        <Link href="">
                            <a className={styles.type1}>無料掲載はこちら</a>
                        </Link>
                    </div>
                : null}
                {item.image_permission !== 0 && !item.official_user_id ?
                    <div className={`${styles.btnArea} ${styles.btnArea2}`}>
                        <Link href="">
                            <a className={styles.type1}>公式ショップ申請はこちら</a>
                        </Link>
                    </div>
                : null}
                {item.official_user_id ?
                    <div className={`${styles.btnArea} ${styles.btnArea3}`}>
                        <Link href="">
                            <a className={styles.type2}>
                                <FontAwesomeIcon icon={faCircleCheck} />
                                公式ページ
                            </a>
                        </Link>
                    </div>
                : null}
                <div className={styles.flex}>
                    <p className={`${styles.link} en`}>
                        <FontAwesomeIcon icon={faLink} />
                        <span>{url}</span>
                    </p>
                    <div className={styles.flex2}>
                        <div className={styles.box}>
                            <button className={styles.icon}>
                                <FontAwesomeIcon icon={faComment} />
                            </button>
                            <p className={`${styles.counter} en`}>{item.d_comments_count}</p>
                        </div>
                        <div className={styles.box}>
                            <button className={styles.icon}>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <p className={`${styles.counter} en`}>{item.d_goods_count}</p>
                        </div>
                        <div className={styles.box}>
                            <button className={styles.icon}>
                                <FontAwesomeIcon icon={faBookmark} />
                            </button>
                            <p className={`${styles.counter} en`}>{item.d_shop_bookmarks_count}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreCard;