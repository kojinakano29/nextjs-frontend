import styles from '@/styles/liondor/components/blogColumn4.module.scss'
import Link from 'next/link'
import { BlogTxt } from '@/components/liondor'
import dummy from '@/images/liondor/cms/dummy.png'

const BlogColumn4 = ({patternData, part2 = false}) => {
  const data = patternData?.l_post?.filter((e, index) => {
    return part2 ? index > 3 && index < 8 : index !== 0 && index < 5
  })

  return (
    <article className={styles.article}>
      {data?.map((item) => (
        <Link href={`/liondor/post/show/${item.id}`} key={item.id}>
          <a className={styles.blogLink}>
            <div className={styles.imgBox}>
              <img src={item.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.thumbs}` : dummy.src} alt="" />
            </div>
            <BlogTxt
              smallMb
              cat={item?.l_category?.parent_slug?.toUpperCase()}
              cat2={item?.l_category?.name}
              ttl={item?.title}
              name={item?.user?.l_profile.nicename}
              time={item?.view_date}
            />
          </a>
        </Link>
      ))}
    </article>
  );
}

export default BlogColumn4;