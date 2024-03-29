import styles from '@/styles/liondor/components/blogPattern9.module.scss'
import { BlogTxt } from '@/components/liondor'
import dummy from '@/images/liondor/cms/dummy.webp'

const BlogPattern9 = ({ pattern, user }) => {
    const data = pattern?.filter((e, index) => {
        return index < 4
    })

    return (
        <article className={styles.article}>
            {data?.map(item => (
                <a
                    href={
                        user ? `/liondor/present/${item?.id}` : '/liondor/login'
                    }
                    key={item?.id}
                    className={styles.blogLink}>
                    <div className={styles.imgBox}>
                        <img
                            src={
                                item?.thumbs
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item?.thumbs}`
                                    : dummy.src
                            }
                            alt="プレゼントのサムネイル画像"
                        />
                    </div>
                    <BlogTxt
                        smallMb
                        ttl={item?.title}
                        name={item?.offer}
                        time={item?.created_at}
                    />
                </a>
            ))}
        </article>
    )
}

export default BlogPattern9
