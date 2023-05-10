import styles from '@/styles/liondor/components/blogPickup.module.scss'
import dummy from '@/images/liondor/cms/dummy.webp'
import { BlogTxt } from '@/components/liondor'

const BlogPickup = ({ patternData, route2 = false, pickup = false }) => {
    const data = route2
        ? patternData?.filter((e, index) => {
              return index === 0
          })
        : patternData?.l_post?.filter((e, index) => {
              return index === 0
          })

    return (
        <>
            <div className={`${styles.pickUp} pc`}>
                {data?.map(item => (
                    <a
                        href={`/liondor/post/show/${
                            pickup ? item?.l_post_id : item?.id
                        }`}
                        key={item?.id}
                        className={styles.blogLink}>
                        <div className={`${styles.imgBox} fill`}>
                            {route2 ? (
                                <img
                                    src={
                                        item?.l_post?.thumbs
                                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item?.l_post?.thumbs}`
                                            : dummy.src
                                    }
                                    alt="記事のサムネイル画像"
                                />
                            ) : (
                                <img
                                    src={
                                        item?.thumbs
                                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item?.thumbs}`
                                            : dummy.src
                                    }
                                    alt="記事のサムネイル画像"
                                />
                            )}
                        </div>
                        {route2 ? (
                            <div className={styles.txtBox}>
                                <BlogTxt
                                    fs22
                                    tac
                                    white
                                    cat={item?.l_post?.l_category?.parent_slug?.toUpperCase()}
                                    cat2={item?.l_post?.l_category?.name}
                                    ttl={item?.l_post?.title}
                                    name={
                                        item?.l_post?.user?.l_profile?.nicename
                                    }
                                    time={item?.l_post?.view_date}
                                />
                            </div>
                        ) : (
                            <div className={styles.txtBox}>
                                <BlogTxt
                                    fs22
                                    tac
                                    white
                                    cat={item?.l_category?.parent_slug?.toUpperCase()}
                                    cat2={item?.l_category?.name}
                                    ttl={item?.title}
                                    name={item?.user?.l_profile?.nicename}
                                    time={item?.view_date}
                                />
                            </div>
                        )}
                    </a>
                ))}
            </div>

            <div className={`${styles.pickUp} sp`}>
                {data?.map(item => (
                    <a
                        href={`/liondor/post/show/${item?.id}`}
                        key={item?.id}
                        className={styles.blogLink}>
                        <div className={`${styles.imgBox}`}>
                            {route2 ? (
                                <img
                                    src={
                                        item?.l_post?.thumbs
                                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item?.l_post?.thumbs}`
                                            : dummy.src
                                    }
                                    alt="記事のサムネイル画像"
                                />
                            ) : (
                                <img
                                    src={
                                        item?.thumbs
                                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item?.thumbs}`
                                            : dummy.src
                                    }
                                    alt="記事のサムネイル画像"
                                />
                            )}
                        </div>
                        {route2 ? (
                            <BlogTxt
                                fs22
                                cat={item?.l_post?.l_category?.parent_slug?.toUpperCase()}
                                cat2={item?.l_post?.l_category?.name}
                                ttl={item?.l_post?.title}
                                name={item?.l_post?.user?.l_profile?.nicename}
                                time={item?.l_post?.view_date}
                            />
                        ) : (
                            <BlogTxt
                                fs22
                                cat={item?.l_category?.parent_slug?.toUpperCase()}
                                cat2={item?.l_category?.name}
                                ttl={item?.title}
                                name={item?.user?.l_profile?.nicename}
                                time={item?.view_date}
                            />
                        )}
                    </a>
                ))}
            </div>
        </>
    )
}

export default BlogPickup
