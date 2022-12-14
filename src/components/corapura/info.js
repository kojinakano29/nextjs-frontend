import styles from '@/styles/corapura/components/info.module.scss'
import Link from 'next/link';
import { Date } from '@/components/corapura'

const Info = ({data, detail = false}) => {
  return (
    <div className={styles.infoBox}>
      {data.map((info, index) => (
        <Link href={info.link} key={index}>
          <a className={`${styles.link} hoverEffect`}>
            <p className={styles.date}><Date dateString={info.created_at} /></p>
            <p className={styles.ttl}>{info.title}</p>
            {detail ? null :
              <div className={styles.company}>
                <div className={styles.logoBox}>
                  {info.c_profile.thumbs ? <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${info.c_profile.thumbs}`} alt="" /> : null}
                </div>
                {info.c_profile.nicename}
              </div>
            }
          </a>
      </Link>
      ))}
    </div>
  );
}

export default Info;