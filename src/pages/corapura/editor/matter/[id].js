import styles from '@/styles/corapura/components/editor.module.scss'
import PageLayoutCorapura from "@/components/Layouts/pageLayoutCorapura";
import Container from '@/components/corapura/Layout/container';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/lib/axios';
import { Loader, PostEditor } from '@/components/corapura';

export const getServerSideProps = async ({params}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_CORAPURA}/post/edit/${params.id}`)
  const data = await res.json()

  return {
    props: {
      posts: data
    }
  }
}

const EditMatter = ({posts}) => {
  // console.log(posts)
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const post = posts.c_post
  const cats = posts.cat
  const tags = post.c_tags.map((tag) => {
    return tag.name
  })
  const tagStr = tags.join(',')

  const router = useRouter()
  const { user } = useAuth({middleware: 'auth', type: 'corapura'})
  const [disabled, setDisabled] = useState(false)
  const [selector, setSelector] = useState(parseInt(post.c_cat_id))
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: post.title,
      c_cat_id: post.c_cat_id,
      date: post?.date ? post.date : null,
      limite_date: post?.limite_date ? post.limite_date : null,
      reward: post?.reward ? post.reward : null,
      hope_reward: post?.hope_reward ? post.hope_reward : null,
      number_of_people: post?.number_of_people ? post.number_of_people : null,
      recruitment_quota: post?.recruitment_quota ? post.recruitment_quota : null,
      speciality: post?.speciality ? post.speciality : null,
      suporter: post?.suporter ? post.suporter : null,
      amount_of_suport: post?.amount_of_suport ? post.amount_of_suport : null,
      medium: post?.medium ? post.medium : null,
      tag: tagStr,
    },
    mode: "onChange",
  })
  const [preview, setPreview] = useState(post.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${post.thumbs}` : "")
  const [editorContent, setEditorContent] = useState()
  const [lock, setLock] = useState(false)

  const onLoadCheck = () => {
    alert("???????????????????????????????????????????????????")
    router.push(`/corapura`)
  }

  useEffect(() => {
    if (user && parseInt(user?.id) !== parseInt(post.user_id)) {
      onLoadCheck()
    }

    if (post.c_post_apps_count !== 0) {
      setLock(true)
    }
  }, [user])

  const onMatterEdit = useCallback(async (data) => {
    await csrf()

    const params = new FormData();
    Object.keys(data).forEach(function(key) {
      params.append(key, this[key])
    }, data)

    await axios.post(`/api/corapura/post/update/${post.id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      // console.log(res)
      alert("??????????????????????????????")
    }).catch((e) => {
      console.error(e)
    })

    await setDisabled(false)
  }, [post, setDisabled])

  const onSubmit = useCallback(async (data) => {
    // console.log(data)
    setDisabled(true)

    onMatterEdit({
      user_id: user?.id,
      title: data.title,
      state: data.state,
      c_cat_id: data.c_cat_id,
      date: data?.date ? data.date : null,
      limite_date: data?.limite_date ? data.limite_date : null,
      reward: data?.reward ? data.reward : null,
      hope_reward: data?.hope_reward ? data.hope_reward : null,
      number_of_people: data?.number_of_people ? data.number_of_people : null,
      recruitment_quota: data?.recruitment_quota ? data.recruitment_quota : null,
      speciality: data?.speciality ? data.speciality : null,
      suporter: data?.suporter ? data.suporter : null,
      amount_of_suport: data?.amount_of_suport ? data.amount_of_suport : null,
      medium: data?.medium ? data.medium : null,
      content: editorContent,
      thumbs: data.thumbs.length !== 0 ? data.thumbs[0] : post.thumbs,
      tag: data.tag,
    })
  }, [setDisabled, onMatterEdit, user, post, editorContent])

  const handleChangeImage = useCallback(async (e) => {
    const { files } = e.target
    if (files[0]) {
      setPreview(window.URL.createObjectURL(files[0]))
    } else {
      setPreview(null)
    }
  }, [setPreview])

  const handleChangeSelect = (e) => {
    setSelector(parseInt(e.target.value))
    reset({
      date: '',
      limite_date: '',
      reward: '',
      hope_reward: '',
      number_of_people: '',
      recruitment_quota: '',
      speciality: '',
      suporter: '',
      amount_of_suport: '',
      medium: '',
    })
  }

  return (
    <>
      <section className="cont1">
        <Container small>
          {user ?
            <form onSubmit={handleSubmit(onSubmit)}>
              <article className={styles.matterFlex}>
                <div className={styles.matterLeft}>
                  <label className={`hoverEffect ${styles.fileBox}`}>
                    {preview ?
                      <img src={preview} alt="" />
                    :
                      "?????????????????????????????????"
                    }
                    <input
                      type="file"
                      accept="image/*"
                      {...register('thumbs')}
                      onChange={handleChangeImage}
                      disabled={lock}
                    />
                  </label>
                </div>
                <div className={styles.matterRight}>
                  <dl>
                    <dt>??????????????????????????????????????????</dt>
                    <dd>
                      <select {...register("c_cat_id")} onChange={(e) => handleChangeSelect(e)} disabled>
                        {cats.map((cat, index) => (
                          <option value={cat.id} key={index}>{cat.name}</option>
                        ))}
                      </select>
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="title">???????????????????????????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="title"
                        {...register("title", {required: true})}
                        disabled={lock}
                      />
                      {errors.title && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="tag">?????????????????????????????????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="tag"
                        {...register("tag", {required: true})}
                        disabled={lock}
                      />
                      {errors.tag && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                </div>
              </article>

              <article className={styles.selectorArea}>
                {
                  selector === 1 ||
                  selector === 10 ||
                  selector === 12 ||
                  selector === 15 ?
                  <dl>
                    <dt>?????????</dt>
                    <dd>
                      <input
                        type="date"
                        {...register("date", {required: true})}
                        disabled={lock}
                      />
                      {errors.date && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector !== 18 ?
                  <dl>
                    <dt>????????????</dt>
                    <dd>
                      <input
                        type="date"
                        {...register("limite_date", {required: true})}
                        disabled={lock}
                      />
                      {errors.limite_date && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 1 ||
                  selector === 10 ||
                  selector === 15 ?
                  <dl>
                    <dt>
                      <label htmlFor="reward">??????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="reward"
                        {...register("reward", {required: true})}
                        disabled={lock}
                      />
                      {errors.reward && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 1 ||
                  selector === 6 ||
                  selector === 7 ||
                  selector === 8 ||
                  selector === 10 ||
                  selector === 12 ||
                  selector === 13 ||
                  selector === 14 ||
                  selector === 15 ||
                  selector === 16 ?
                  <dl>
                    <dt>
                      <label htmlFor="number_of_people">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="number_of_people"
                        {...register("number_of_people", {required: true})}
                        disabled={lock}
                      />
                      {errors.number_of_people && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 2 ||
                  selector === 3 ||
                  selector === 4 ||
                  selector === 7 ||
                  selector === 11 ||
                  selector === 12 ?
                  <dl>
                    <dt>
                      <label htmlFor="hope_reward">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="hope_reward"
                        {...register("hope_reward", {required: true})}
                        disabled={lock}
                      />
                      {errors.hope_reward && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 2 ||
                  selector === 3 ||
                  selector === 4 ||
                  selector === 5 ||
                  selector === 11 ?
                  <dl>
                    <dt>
                      <label htmlFor="recruitment_quota">???????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="recruitment_quota"
                        {...register("recruitment_quota", {required: true})}
                        disabled={lock}
                      />
                      {errors.recruitment_quota && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 9 ?
                  <dl>
                    <dt>
                      <label htmlFor="speciality">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="speciality"
                        {...register("speciality", {required: true})}
                        disabled={lock}
                      />
                      {errors.speciality && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 17 ?
                  <dl>
                    <dt>
                      <label htmlFor="suporter">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="suporter"
                        {...register("suporter", {required: true})}
                        disabled={lock}
                      />
                      {errors.suporter && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 17 ?
                  <dl>
                    <dt>
                      <label htmlFor="amount_of_suport">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="amount_of_suport"
                        {...register("amount_of_suport", {required: true})}
                        disabled={lock}
                      />
                      {errors.amount_of_suport && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
                {
                  selector === 18 ?
                  <dl>
                    <dt>
                      <label htmlFor="medium">??????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="medium"
                        {...register("medium", {required: true})}
                        disabled={lock}
                      />
                      {errors.medium && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  : null
                }
              </article>

              <article className={styles.editArea}>
                <dl>
                  <dt>??????</dt>
                  <dd className={lock ? styles.lock : null}>
                    <PostEditor matter setEditorContent={setEditorContent} content={post.content} edit />
                  </dd>
                </dl>
              </article>

              <div className={styles.submitFlex}>
                <button className={`${styles.submitBtn2} hoverEffect`} disabled={disabled}>
                  <label>
                    ??????
                    <input
                      type="radio"
                      value="0"
                      {...register("state")}
                      disabled={disabled}
                    />
                  </label>
                </button>
                <button className={`${styles.submitBtn2} ${styles.submitBtn3} hoverEffect`} disabled={disabled}>
                  <label>
                    ???????????????
                    <input
                      type="radio"
                      value="4"
                      {...register("state")}
                      disabled={disabled}
                    />
                  </label>
                </button>
              </div>
            </form>
          : <Loader />}
        </Container>
      </section>
    </>
  );
}

export default EditMatter;

EditMatter.getLayout = function getLayout(page) {
  return <PageLayoutCorapura>{page}</PageLayoutCorapura>
}