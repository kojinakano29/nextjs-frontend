import styles from '@/styles/corapura/components/detailArea.module.scss'
import { useCallback, useContext, useEffect, useState } from 'react';
import { CompanyContext } from './detailArea';
import dummy1 from '@/images/corapura/common/userDummy.svg'
import mail from '@/images/corapura/common/mail_icon.svg'
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import Social from './social';

const DetailAreaRight = ({influencer = false}) => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const { profile, userInfo } = useContext(CompanyContext)
  const { user } = useAuth()

  const companySocials = profile?.c_company_profile?.c_company_socials
  const userSocials = profile.c_user_profile?.c_user_socials
  const [disabled, setDisabled] = useState(false)
  const [followCheck, setFollowCheck] = useState(false)
  const [nowFollower, setNowFollower] = useState(userInfo.c_followeds_count)

  const onLoadCheck = async () => {
    await csrf()

    await axios.post('/api/corapura/follow/check', {
      user_id: user?.id,
    }).then((res) => {
      // console.log(res)
      if (res.data.includes(userInfo.id)) {
        setFollowCheck(true)
      }
    }).catch((e) => {
      console.error(e)
    })
  }

  useEffect(() => {
    if (user) {
      onLoadCheck()
    }
  }, [user])

  const handleClickFollow = useCallback(async () => {
    if (disabled) return
    setDisabled(true)
    await csrf()

    if (followCheck) {
      await axios.delete('/api/corapura/follow/delete', {
        data: {
          following_user_id: user?.id,
          followed_user_id: userInfo.id,
        }
      }).then((res) => {
        // console.log(res)
        setFollowCheck(false)
        setNowFollower(nowFollower-1)
      }).catch((e) => {
        console.error(e)
      })
    } else {
      await axios.post('/api/corapura/follow/store', {
        following_user_id: user?.id,
        followed_user_id: userInfo.id,
      }).then((res) => {
        // console.log(res)
        setFollowCheck(true)
        setNowFollower(nowFollower+1)
      }).catch((e) => {
        console.error(e)
      })
    }

    await setDisabled(false)
  }, [disabled, setDisabled, user, followCheck, setFollowCheck])

  return (
    <>
      {!influencer ?
        <div className={styles.detailRight}>
          <div className={styles.detailHead}>
            <div className={styles.headLeft}>
              <img src={profile.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.thumbs}` : dummy1.src} alt="" />
            </div>
            <div className={styles.headRight}>
              <p className={styles.type}>{profile.title}</p>
              <p className={styles.name}>{profile.nicename}</p>
              <div className={styles.tags}>
                {profile.c_tags.map((tag, index) => (
                  <p className={styles.tag} key={index}>{tag.name}</p>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.followBox}>
            <p className={styles.count}>???????????????{nowFollower}???</p>
            <button
              type="button"
              className="hoverEffect"
              onClick={handleClickFollow}
            >{followCheck ? "???????????????" : "??????????????????"}</button>
          </div>
          <p className={styles.desc}>{profile.profile}</p>
          <div className={styles.infoGraph}>
            <dl>
              <dt>?????????</dt>
              <dd>{profile.c_company_profile.president}</dd>
            </dl>
            <dl>
              <dt>??????</dt>
              <dd>{profile.c_company_profile.maked}</dd>
            </dl>
            <dl>
              <dt>??????????????????</dt>
              <dd>{profile.c_company_profile.jojo}</dd>
            </dl>
            <dl>
              <dt>?????????</dt>
              <dd>{profile.c_company_profile.capital}</dd>
            </dl>
            <dl>
              <dt>???????????????</dt>
              <dd>{profile.c_company_profile.address}</dd>
            </dl>
            <dl>
              <dt>????????????</dt>
              <dd>{profile.c_company_profile.tel}</dd>
            </dl>
          </div>
          <Social socials={companySocials} />
          <div className={styles.siteUrl}>
            {profile.c_company_profile.site_url ?
              <>
                <p>???????????????????????????</p>
                <a href={profile.c_company_profile.site_url} target="_balnk">{profile.c_company_profile.site_url}</a>
              </>
            : null}
            {profile.c_company_profile.shop_url ?
              <>
                <p>EC?????????</p>
                <a href={profile.c_company_profile.shop_url} target="_balnk">{profile.c_company_profile.shop_url}</a>
              </>
            : null}
          </div>
          <a href={`mailto:${userInfo.email}`} className={styles.btn}>
            <img src={mail.src} alt="" />
            <span>???????????????????????????????????????</span>
          </a>
        </div>
      :
        <div className={styles.detailRight}>
          <div className={styles.detailHead}>
            <div className={styles.headLeft}>
              <img src={profile.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.thumbs}` : dummy1.src} alt="" />
            </div>
            <div className={styles.headRight}>
              <p className={styles.catch}>{profile.title}</p>
              <p className={styles.name}>{profile.nicename}</p>
              <p className={styles.type}>??????</p>
              <div className={styles.tags}>
                {profile.c_tags.map((tag, index) => (
                  <p className={styles.tag} key={index}>{tag.name}</p>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.skills}>
            {profile.c_user_profile.c_user_skills.map((skill, index) => (
              <p className={styles.skill} key={index}>{skill.name}</p>
            ))}
          </div>
          <div className={styles.followBox}>
            <p className={styles.count}>???????????????{nowFollower}???</p>
            <button
              type="button"
              className="hoverEffect"
              onClick={handleClickFollow}
            >{followCheck ? "???????????????" : "??????????????????"}</button>
          </div>
          <p className={styles.desc}>{profile.profile}</p>
          <Social socials={userSocials} user />
          {profile.c_user_profile.brand ?
            <div className={styles.siteUrl}>
              <p>??????????????????????????????</p>
              <a href={profile.c_user_profile.brand} target="_blank">{profile.c_user_profile.brand}</a>
            </div>
          : null}
          <a href={`mailto:${userInfo.email}`} className={styles.btn}>
            <img src={mail.src} alt="" />
            <span>?????????????????????????????????<br className="sp" />????????????????????????</span>
          </a>
        </div>
      }
    </>
  );
}

export default DetailAreaRight;