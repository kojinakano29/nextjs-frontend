import styles from '@/styles/corapura/components/editor.module.scss'
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from '@/lib/axios';
import Container from './Layout/container';
import { Loader } from '@/components/corapura';
import { UserContext } from '@/pages/corapura/editor/user/[id]';
import { socialNetworkingService } from '@/lib/corapura/constants';

const EditUserForm = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const {
    profile,
    option,
    type,
    targetId,
    setSns,
    setCards,
    setLikes,
    handleClickCreate,
    handleClickEdit,
    disabled,
    setDisabled,
    editData,
    setEditData,
  } = useContext(UserContext)

  const [preview, setPreview] = useState()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
  })

  const onLoadDefault = async () => {
    if (type === "card") {
      setValue("cardTitle", editData.title)
      setPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${editData.thumbs}`)
    } else if (type === "like") {
      setValue("likeTitle", editData.title)
      setValue("likeTxt", editData.text)
      setPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${editData.thumbs}`)
    } else if (type === "sns") {
      setValue("snsName", editData.name)
      setValue("snsUrl", editData.url)
      setValue("snsFollower", editData.follower)
    }
  }

  useEffect(() => {
    if (!disabled) {
      onLoadDefault()
    }
  }, [disabled])

  const onSubmitCard = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    const datas = {
      c_profile_id: profile.id,
      title: data.cardTitle,
      thumbs: data.cardThumbs && data.cardThumbs?.length !== 0 ? data.cardThumbs[0] : editData.thumbs,
    }

    const params = new FormData();
    Object.keys(datas).forEach(function(key) {
      params.append(key, this[key])
    }, datas)

    await axios.post(`/api/corapura/card/update/${targetId}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      // console.log(res)
      setCards(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitLike = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    const datas = {
      c_profile_id: profile.id,
      title: data.likeTitle,
      text: data.likeTxt,
      thumbs: data.likeThumbs && data.likeThumbs?.length !== 0 ? data.likeThumbs[0] : editData.thumbs,
    }

    const params = new FormData();
    Object.keys(datas).forEach(function(key) {
      params.append(key, this[key])
    }, datas)

    await axios.post(`/api/corapura/like/update/${targetId}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      // console.log(res)
      setLikes(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitSns = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/corapura/mypage/c_user_social/update/${targetId}`, {
      c_user_profile_id: option.id,
      name: data.snsName,
      url: data.snsUrl,
      follower: data.snsFollower,
    }).then((res) => {
      // console.log(res)
      setSns(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const handleChangeFile = useCallback((e) => {
    const { files } = e.target
    if (files[0]) {
      setPreview(window.URL.createObjectURL(files[0]))
    } else {
      setPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${editData.thumbs}`)
    }
  }, [setPreview])

  return (
    <section className={styles.popupArea} onClick={() => handleClickCreate(type)}>
      <Container small900>
        <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
          <h4 className={styles.midashi}>
            {type === "sns" ? "SNS????????????" : null}
            {type === "card" ? "??????" : null}
            {type === "like" ? "?????????????????????" : null}
            ??????
          </h4>
          {disabled ? <Loader /> :
            <article className={styles.formArea}>
              {/* SNS */}
              {type === "sns" ?
                <form onSubmit={handleSubmit(onSubmitSns)}>
                  <dl>
                    <dt>
                      <label htmlFor="snsName">SNS???</label>
                    </dt>
                    <dd>
                      <select {...register("snsName")}>
                        {socialNetworkingService.map((name, index) => (
                          <option value={name} key={index}>{name}</option>
                        ))}
                      </select>
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="snsUrl">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="url"
                        id="snsUrl"
                        {...register("snsUrl", {required: true})}
                      />
                      {errors.snsUrl && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="snsFollower">??????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="number"
                        id="snsFollower"
                        {...register("snsFollower", {required: true})}
                      />
                      {errors.snsFollower && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* SNS */}

              {/* ?????? */}
              {type === "card" ?
                <form onSubmit={handleSubmit(onSubmitCard)}>
                  <dl>
                    <dt>
                      <label htmlFor="cardTitle">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="cardTitle"
                        {...register("cardTitle", {required: true})}
                      />
                      {errors.cardTitle && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="cardThumbs">??????</label>
                    </dt>
                    <dd>
                      <div className={styles.imgBox}>
                        {preview ? <img src={preview} alt="" /> : <div className={styles.imgNone}></div>}
                      </div>
                      <input
                        type="file"
                        id="cardThumbs"
                        accept="image/*"
                        {...register("cardThumbs")}
                        onChange={handleChangeFile}
                      />
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ?????? */}

              {/* ??????????????????????????? */}
              {type === "like" ?
                <form onSubmit={handleSubmit(onSubmitLike)}>
                  <dl>
                    <dt>
                      <label htmlFor="likeTitle">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="likeTitle"
                        {...register("likeTitle", {required: true})}
                      />
                      {errors.likeTitle && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="likeTxt">?????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="likeTxt"
                        {...register("likeTxt", {required: true})}
                      />
                      {errors.likeTxt && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="likeThumbs">??????</label>
                    </dt>
                    <dd>
                      <div className={styles.imgBox}>
                        {preview ? <img src={preview} alt="" /> : <div className={styles.imgNone}></div>}
                      </div>
                      <input
                        type="file"
                        id="likeThumbs"
                        accept="image/*"
                        {...register("likeThumbs")}
                        onChange={handleChangeFile}
                      />
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ??????????????????????????? */}
            </article>
          }
        </div>
      </Container>
    </section>
  );
}

export default EditUserForm;