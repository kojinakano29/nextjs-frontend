import styles from '@/styles/dellamall/components/shopDetailArea.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComment,
    faHeart,
    faBookmark,
    faReply,
    faFlag,
    faChevronDown,
    faThumbsUp,
    faCheck,
} from '@fortawesome/free-solid-svg-icons'
import notSet from '@/images/dellamall/shopDetail/user-after.svg'
import notSet2 from '@/images/dellamall/shopDetail/user.svg'
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { SaveMall, Social } from '@/components/dellamall'
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
} from 'react-share'
import Container from './Layouts/container'
import useRedirect from '@/hooks/redirect'

export const SaveMallContext = createContext()

const ShopDetailArea = ({ data, user }) => {
    console.log(data)
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const { loginCheck } = useRedirect()
    const router = useRouter()
    const shop = data.shop
    const comments = shop.d_comments
    const goods = shop.d_goods
    const malls = shop.d_malls
    const tags = shop.d_tags
    const pickup = shop.d_pickups
    const socials = shop.d_socials
    const ref = useRef()
    const [commentOpen, setCommentOpen] = useState(true)
    const processing = useRef(false)
    const [userThumbs, setUserThumbs] = useState()
    const [goodState, setGoodState] = useState(false)
    const [commentGood, setCommentGood] = useState([])
    const [countGood, setCountGood] = useState(goods.length)
    const [countMall, setCountMall] = useState(malls.length)
    const [saveMallOpen, setSaveMallOpen] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)
    const [spamOpen, setSpamOpen] = useState(false)
    const [spamModal, setSpamModal] = useState(false)
    const [spamMessage, setSpamMessage] = useState('')

    const spams = [
        'スパムである',
        'ヌードまたは性的行為',
        'ヘイトスピーチまたは差別的なシンボル',
        '暴力または危険な団体',
        '違法または規制対象商品の販売',
        'いじめまたは嫌がらせ',
        '知的財産権の侵害',
        'その他',
    ]

    const loadGoodState = useCallback(async () => {
        const filter = goods.filter(item => {
            return item.id === user?.id
        })

        if (filter.length === 1) {
            setGoodState(true)
        } else {
            setGoodState(false)
        }
    }, [user])

    const loadCommentGoodState = useCallback(async () => {
        await csrf()

        await axios
            .post('/api/dellamall/comment/shop_return', {
                user_id: user?.id,
            })
            .then(res => {
                // console.log(res)
                setCommentGood(res.data)
            })
            .catch(e => {
                console.error(e)
            })
    }, [user])

    useEffect(() => {
        loadGoodState()
        loadCommentGoodState()
    }, [user])

    const handleClickGood = async () => {
        await loginCheck(user, '/dellamall/login', 'ログインしてください')
        if (!user) return
        if (processing.current) return
        processing.current = true
        await csrf()

        if (goodState) {
            await axios
                .delete('/api/dellamall/shop/good/delete', {
                    data: {
                        user_id: user?.id,
                        d_shop_id: shop.id,
                    },
                })
                .then(res => {
                    // console.log(res)
                    setGoodState(false)
                    setCountGood(countGood - 1)
                })
                .catch(e => {
                    console.error(e)
                    alert('エラーが発生しました。')
                })
        } else {
            await axios
                .post('/api/dellamall/shop/good/store', {
                    user_id: user?.id,
                    d_shop_id: shop.id,
                })
                .then(res => {
                    // console.log(res)
                    setGoodState(true)
                    setCountGood(countGood + 1)
                })
                .catch(e => {
                    console.error(e)
                    alert('エラーが発生しました。')
                })
        }

        processing.current = false
    }

    const handleClickComment = () => {
        setCommentOpen(prevState => !prevState)
    }

    const handleClickCommentGoodAdd = async commentId => {
        await loginCheck(user, '/dellamall/login', 'ログインしてください')
        if (!user) return
        if (processing.current) return
        processing.current = true
        await csrf()

        await axios
            .post('/api/dellamall/d_comment_good/store', {
                user_id: user?.id,
                d_comment_id: commentId,
            })
            .then(res => {
                // console.log(res)
                setCommentGood([...commentGood, res.data.d_comment_id])
            })
            .catch(e => {
                console.error(e)
            })

        processing.current = false
    }

    const handleClickCommentGoodDelete = async commentId => {
        if (processing.current) return
        processing.current = true
        await csrf()

        await axios
            .delete('/api/dellamall/d_comment_good/delete', {
                data: {
                    user_id: user?.id,
                    d_comment_id: commentId,
                },
            })
            .then(res => {
                // console.log(res)
                setCommentGood(
                    commentGood.filter(item => {
                        return item !== commentId
                    }),
                )
            })
            .catch(e => {
                console.error(e)
            })

        processing.current = false
    }

    const getUser = useCallback(async () => {
        await csrf()

        await axios
            .post('/api/d_profile_get', {
                id: user?.id,
            })
            .then(res => {
                // console.log(res)
                if (res.data.thumbs) {
                    setUserThumbs(res.data.thumbs)
                }
            })
            .catch(e => {
                console.error(e)
            })
    }, [user])

    useEffect(() => {
        if (user) {
            getUser()
        }
    }, [user])

    const handleClickSaveMall = useCallback(async () => {
        await loginCheck(user, '/dellamall/login', 'ログインしてください')
        if (!user) return
        await setSaveMallOpen(prevState => !prevState)
    }, [user])

    const handleClickShare = useCallback(async () => {
        await setShareOpen(prevState => !prevState)
    }, [])

    const handleClickSpam = useCallback(async () => {
        await setSpamOpen(prevState => !prevState)
    }, [])

    const handleClickSpamModal = useCallback(async message => {
        await setSpamModal(prevState => !prevState)
        await setSpamMessage(message)
    }, [])

    const handleClickSpamSubmit = async () => {
        if (processing.current) return
        processing.current = true
        await csrf()

        await axios
            .post('/api/dellamall/report', {
                user_id: user?.id,
                message: spamMessage,
            })
            .then(res => {
                // console.log(res)
                alert('スパムを報告しました。')
                handleClickSpamModal('')
            })
            .catch(e => {
                console.error(e)
            })

        processing.current = false
    }

    const { register, handleSubmit } = useForm()
    const onSubmit = useCallback(
        async data => {
            await loginCheck(user, '/dellamall/login', 'ログインしてください')
            if (!user) return
            if (processing.current) return
            processing.current = true
            if (data.comment === '') return
            // console.log(data)

            await csrf()

            await axios
                .post(`/api/dellamall/shop/comment_add/${shop.id}`, {
                    user_id: user?.id,
                    content: data.comment,
                })
                .then(res => {
                    // console.log(res)
                    router.reload()
                })
                .catch(e => {
                    console.error(e)
                })

            processing.current = false
        },
        [user],
    )

    const handleClickPickup = async () => {
        await loginCheck(user, '/dellamall/login', 'ログインしてください')
        if (!user) return
        if (processing.current) return
        processing.current = true
        await csrf()

        if (pickup.length !== 0) {
            await axios
                .delete(`/api/dellamall/d_pickups/delete/${pickup?.[0]?.id}`)
                .then(res => {
                    // console.log(res)
                    alert('ピックアップから削除しました。')
                    router.reload()
                })
                .catch(e => {
                    console.error(e)
                })
        } else {
            await axios
                .post('/api/dellamall/d_pickups/store', {
                    d_shop_id: shop.id,
                })
                .then(res => {
                    // console.log(res)
                    alert('ピックアップに追加しました。')
                    router.reload()
                })
                .catch(e => {
                    console.error(e)
                })
        }

        processing.current = false
    }

    return (
        <>
            {saveMallOpen ? (
                <div className="curtain" onClick={handleClickSaveMall}></div>
            ) : null}
            {shareOpen ? (
                <div className="curtain" onClick={handleClickShare}></div>
            ) : null}
            {spamOpen ? (
                <div className="curtain" onClick={handleClickSpam}></div>
            ) : null}

            <div className={styles.cont1__flex}>
                <div className={styles.cont1__flexLeft}>
                    <a
                        href={shop.url}
                        target="_blank"
                        className={`${styles.cont1__imgBox} hoverEffect`}>
                        {shop.image_permission === 1 && shop.thumbs ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${shop.thumbs}`}
                                alt="ショップの画像"
                            />
                        ) : (
                            <div className={styles.imgNone}>{shop.name}</div>
                        )}
                    </a>
                    <div className={styles.cont1__flexLeft__btnFlex}>
                        {shop.image_permission === 0 ? (
                            <a
                                href="/dellamall/contact/?type=captcha"
                                className={`${styles.contactLink} hoverEffect`}>
                                ショップオーナー
                                <br />
                                無料キャプチャ申請
                            </a>
                        ) : null}
                        {shop.official_user_id ? null : (
                            <a
                                href="/dellamall/officialRequest"
                                className={`${styles.contactLink} hoverEffect`}>
                                ショップオーナー
                                <br />
                                公式申請
                            </a>
                        )}
                        {user?.account_type > 2 ? (
                            <button
                                type="button"
                                className={`${`${styles.contactLink} ${
                                    pickup.length !== 0 ? styles.on : null
                                }`} hoverEffect`}
                                onClick={handleClickPickup}>
                                {pickup.length !== 0
                                    ? 'ピックアップから削除'
                                    : 'ピックアップに追加'}
                            </button>
                        ) : null}
                    </div>
                </div>
                <div className={styles.cont1__flexRight}>
                    <div className={styles.cont1__flexRight__icon}>
                        <ul className={styles.cont1__flexRight__iconLeft}>
                            <li>
                                <button className="hoverNone" type="button">
                                    <FontAwesomeIcon icon={faComment} />
                                </button>
                                <p className={`${styles.num} en`}>
                                    {data.comments_count}
                                </p>
                            </li>
                            <li>
                                <button
                                    className={goodState ? styles.on : ''}
                                    type="button"
                                    onClick={handleClickGood}>
                                    <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <p className={`${styles.num} en`}>
                                    {countGood}
                                </p>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={saveMallOpen ? styles.on : null}
                                    onClick={handleClickSaveMall}>
                                    <FontAwesomeIcon icon={faBookmark} />
                                </button>
                                <p className={`${styles.num} en`}>
                                    {countMall}
                                </p>
                                <SaveMallContext.Provider
                                    value={{
                                        handleClickSaveMall,
                                        countMall,
                                        setCountMall,
                                        user,
                                        shop,
                                    }}>
                                    {saveMallOpen ? <SaveMall /> : null}
                                </SaveMallContext.Provider>
                            </li>
                        </ul>
                        <ul className={styles.cont1__flexRight__iconRight}>
                            <li>
                                <button
                                    className={shareOpen ? styles.on : ''}
                                    type="button"
                                    onClick={handleClickShare}>
                                    <FontAwesomeIcon
                                        icon={faReply}
                                        transform="flip-h"
                                    />
                                </button>
                                {shareOpen ? (
                                    <div
                                        className={styles.activeArea}
                                        onClick={e => e.stopPropagation()}>
                                        <p className={styles.activeTtl}>
                                            シェアする
                                        </p>
                                        <div className={styles.activeFlex}>
                                            <FacebookShareButton
                                                url={[
                                                    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${router.asPath}`,
                                                ]}>
                                                <FacebookIcon size={40} round />
                                            </FacebookShareButton>
                                            <TwitterShareButton
                                                url={[
                                                    [
                                                        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${router.asPath}`,
                                                    ],
                                                ]}>
                                                <TwitterIcon size={40} round />
                                            </TwitterShareButton>
                                        </div>
                                    </div>
                                ) : null}
                            </li>
                            <li>
                                <button
                                    className={spamOpen ? styles.on : ''}
                                    type="button"
                                    onClick={handleClickSpam}>
                                    <FontAwesomeIcon icon={faFlag} />
                                </button>
                                {spamOpen ? (
                                    <div
                                        className={styles.activeArea}
                                        onClick={e => e.stopPropagation()}>
                                        <p className={styles.activeTtl}>
                                            投稿を報告する
                                        </p>
                                        <div className={styles.spamBox}>
                                            {spams.map((spam, index) => (
                                                <button
                                                    type="button"
                                                    className={styles.spamBtn}
                                                    onClick={() =>
                                                        handleClickSpamModal(
                                                            spam,
                                                        )
                                                    }
                                                    key={index}>
                                                    {spam}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {spamModal ? (
                                    <div
                                        className={styles.spamModal}
                                        onClick={() =>
                                            handleClickSpamModal('')
                                        }>
                                        <Container small900>
                                            <div
                                                className={styles.modalArea}
                                                onClick={e =>
                                                    e.stopPropagation()
                                                }>
                                                <p className={styles.check}>
                                                    本当に「
                                                    <span>{spamMessage}</span>」
                                                    <br className="sp" />
                                                    として報告しますか？
                                                </p>
                                                <div className={styles.btnFlex}>
                                                    <button
                                                        className={styles.btn}
                                                        type="button"
                                                        onClick={
                                                            handleClickSpamSubmit
                                                        }>
                                                        はい
                                                    </button>
                                                    <button
                                                        className={`${styles.btn} ${styles.btn2}`}
                                                        type="button"
                                                        onClick={() =>
                                                            handleClickSpamModal(
                                                                '',
                                                            )
                                                        }>
                                                        いいえ
                                                    </button>
                                                </div>
                                            </div>
                                        </Container>
                                    </div>
                                ) : null}
                            </li>
                        </ul>
                    </div>
                    <div className={styles.cont1__flexRight__topUrl}>
                        {shop.official_user_id ? (
                            <div className={styles.official_icon}>
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                        ) : null}
                        <a href={shop.url} target="_blank">
                            {shop.url}
                        </a>
                    </div>
                    <p className={styles.cont1__flexRight__topName}>
                        {shop.name}
                    </p>
                    <ul className={styles.cont1__flexRight__topWords}>
                        {tags?.map((tag, index) => (
                            <li className={styles.keyWord__item} key={index}>
                                <a
                                    href={`/dellamall/shop/?tag_id=${tag.id}`}
                                    className="hoverEffect">
                                    {tag.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.cont1__flexRight__middleText}>
                        {shop.description}
                    </p>
                    <a
                        className={`${styles.cont1__flexRight__profile} hoverEffect`}
                        href={`/dellamall/mypage/${
                            shop.official_user_id
                                ? shop.official_user_id
                                : shop.user.id
                        }`}>
                        <div className={styles.iconBox}>
                            {shop.official_user_id &&
                            shop?.d_official?.d_profile.thumbs ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${shop?.d_official?.d_profile.thumbs}`}
                                    alt="プロフィール画像"
                                />
                            ) : (
                                <img
                                    src={notSet.src}
                                    alt="プロフィール画像未設定"
                                />
                            )}
                            {!shop.official_user_id &&
                            shop.user.d_profile.thumbs ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${shop.user.d_profile.thumbs}`}
                                    alt="プロフィール画像"
                                />
                            ) : (
                                <img
                                    src={notSet.src}
                                    alt="プロフィール画像未設定"
                                />
                            )}
                        </div>
                        <p className={styles.pName}>
                            {shop.official_user_id
                                ? shop?.d_official?.d_profile.nicename
                                : shop.user.d_profile.nicename}
                        </p>
                    </a>
                    <div className={styles.cont1__flexRight__middleComment}>
                        <p className={styles.total}>
                            コメント：<span>{data.comments_count}</span>件
                            <button type="button" onClick={handleClickComment}>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    size="xs"
                                    transform={
                                        commentOpen ? null : 'rotate-270'
                                    }
                                />
                            </button>
                        </p>
                        <div className={styles.comment__box}>
                            <ul
                                ref={ref}
                                style={
                                    commentOpen
                                        ? {
                                              maxHeight:
                                                  ref.current?.scrollHeight,
                                          }
                                        : { maxHeight: '0px' }
                                }>
                                {comments.map(comment => (
                                    <li key={comment.id}>
                                        <div className={styles.user__img}>
                                            <img
                                                src={
                                                    comment.user.d_profile
                                                        .thumbs
                                                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${comment.user.d_profile.thumbs}`
                                                        : notSet.src
                                                }
                                                alt="プロフィール画像"
                                            />
                                        </div>
                                        <div className={styles.user__comment}>
                                            <a
                                                href={`/dellamall/mypage/${comment.user_id}`}
                                                className={styles.name}>
                                                {
                                                    comment.user.d_profile
                                                        .nicename
                                                }
                                            </a>
                                            <p className={styles.content}>
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className={styles.user__right}>
                                            <button
                                                type="button"
                                                className={
                                                    commentGood?.includes(
                                                        comment.id,
                                                    )
                                                        ? styles.on
                                                        : null
                                                }
                                                onClick={() => {
                                                    if (
                                                        commentGood?.includes(
                                                            comment.id,
                                                        )
                                                    ) {
                                                        handleClickCommentGoodDelete(
                                                            comment.id,
                                                        )
                                                    } else {
                                                        handleClickCommentGoodAdd(
                                                            comment.id,
                                                        )
                                                    }
                                                }}>
                                                <FontAwesomeIcon
                                                    icon={faThumbsUp}
                                                />
                                                <span>参考になった</span>
                                            </button>
                                            <a
                                                href="/dellamall/contact/?type=spam"
                                                className={`${styles.spamLink} hoverEffect`}>
                                                通報する
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.comment__input}>
                                <div className={styles.user__img}>
                                    <img
                                        src={
                                            userThumbs
                                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${userThumbs}`
                                                : notSet2.src
                                        }
                                        alt="プロフィール画像"
                                    />
                                </div>
                                <textarea
                                    type="text"
                                    {...register('comment', { required: true })}
                                    placeholder="コメントを追加する"></textarea>
                                <button
                                    className={`${styles.comment__submit} hoverEffect`}>
                                    送信
                                </button>
                            </div>
                        </form>
                    </div>
                    <Social socials={socials} salon={data.salon?.[0]} />
                </div>
            </div>
        </>
    )
}

export default ShopDetailArea
