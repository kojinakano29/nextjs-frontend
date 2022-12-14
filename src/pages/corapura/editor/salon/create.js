import styles from '@/styles/corapura/components/editor.module.scss'
import PageLayoutCorapura from "@/components/Layouts/pageLayoutCorapura";
import Container from '@/components/corapura/Layout/container';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/lib/axios';
import { Loader, PostEditor } from '@/components/corapura';
import Link from 'next/link';

const CreateSalon = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const router = useRouter()
  const { user } = useAuth({middleware: 'auth', type: 'corapura'})
  const [disabled, setDisabled] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  })
  const [preview, setPreview] = useState()
  const [editorContent, setEditorContent] = useState()

  const onSalonCreate = useCallback(async (data) => {
    await csrf()

    const params = new FormData();
    Object.keys(data).forEach(function(key) {
      params.append(key, this[key])
    }, data)

    await axios.post(`/api/corapura/salon/store`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      // console.log(res)
      if (res.data.state === "1") {
        alert("オンラインサロンを作成しました。")
      } else if (res.data.state === "0") {
        alert("オンラインサロンを下書きで作成しました。")
      }
      router.push({
        pathname: '/corapura/editor/salon/[salonId]',
        query: { salonId: res.data.id },
      })
    }).catch((e) => {
      console.error(e)
    })

    await setDisabled(false)
  }, [setDisabled])

  const onSubmit = useCallback(async (data) => {
    // console.log(data)
    setDisabled(true)

    onSalonCreate({
      user_id: user?.id,
      tag: data.tag,
      title: data.title,
      thumbs: data.thumbs[0],
      date: data.date,
      plan: data.plan,
      number_of_people: data.number_of_people,
      content: editorContent,
      state: data.state,
    })
  }, [setDisabled, onSalonCreate, user, editorContent])

  const handleChangeImage = useCallback(async (e) => {
    const { files } = e.target
    if (files[0]) {
      setPreview(window.URL.createObjectURL(files[0]))
    } else {
      setPreview(null)
    }
  }, [setPreview])

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
                      "フォルダから画像を選択"
                    }
                    <input
                      type="file"
                      accept="image/*"
                      {...register('thumbs')}
                      onChange={handleChangeImage}
                    />
                  </label>
                </div>
                <div className={styles.matterRight}>
                  <dl>
                    <dt>
                      <label htmlFor="title">サロン名を入力ください</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="title"
                        {...register("title", {required: true})}
                      />
                      {errors.title && <p className={styles.error}>必須項目を入力してください</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="tag">サロン内容に合ったタグを選択ください</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="tag"
                        {...register("tag", {required: true})}
                      />
                      {errors.tag && <p className={styles.error}>必須項目を入力してください</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="date">開催日</label>
                    </dt>
                    <dd>
                      <input
                        type="date"
                        id="date"
                        {...register("date", {required: true})}
                      />
                      {errors.date && <p className={styles.error}>必須項目を入力してください</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="plan">月額費用</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="plan"
                        {...register("plan", {required: true})}
                      />
                      {errors.plan && <p className={styles.error}>必須項目を入力してください</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="number_of_people">入会上限人数</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="number_of_people"
                        {...register("number_of_people", {required: true})}
                      />
                      {errors.number_of_people && <p className={styles.error}>必須項目を入力してください</p>}
                    </dd>
                  </dl>
                </div>
              </article>

              <article className={styles.editArea}>
                <dl>
                  <dt>本文</dt>
                  <dd>
                    <PostEditor salon setEditorContent={setEditorContent} />
                  </dd>
                </dl>
              </article>

              <div className={styles.checkArea}>
                <label>
                  <input
                    type="checkbox"
                    {...register("check", {required: true})}
                  />
                  <p className={styles.txt}>
                    <Link href={`/corapura/terms`}><a>利用規約</a></Link>に同意します
                  </p>
                </label>
                {errors.check && <p className={styles.error}>チェック必須項目です</p>}
              </div>

              <div className={styles.submitFlex}>
                <button className={`${styles.submitBtn2} hoverEffect`} disabled={disabled}>
                  <label>
                    作成
                    <input
                      type="radio"
                      value="1"
                      {...register("state")}
                      disabled={disabled}
                    />
                  </label>
                </button>
                <button className={`${styles.submitBtn2} ${styles.submitBtn3} hoverEffect`} disabled={disabled}>
                  <label>
                    下書き保存
                    <input
                      type="radio"
                      value="0"
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

export default CreateSalon;

CreateSalon.getLayout = function getLayout(page) {
  return <PageLayoutCorapura>{page}</PageLayoutCorapura>
}