import styles from '@/styles/components/CreatePost.module.scss'
import axios from '@/lib/axios'; // カスタムフック
import { useCallback, useRef, useState } from 'react'
import { PostEditor } from '@/components';

// SSG
// export const getStaticProps = async () => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/liondor/post/create`)
//   const data = await res.json()

//   return {
//     props: {
//       posts: data
//     }
//   }
// }

// SSR
export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/liondor/post/create`)
  const data = await res.json()

  return {
      props: {
          posts: data
      }
  }
}

const CreatePost = ({posts}) => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const [editorContent, setEditorContent] = useState()

  const userIdRef = useRef(null)
  const catIdRefs = useRef(null)
  const catChildIdRefs = useRef(null)
  const seriesIdRefs = useRef(null)
  const ttlRefs = useRef(null)
  const thumbRefs = useRef(null)
  const mvRefs = useRef(null)
  const subTtlRefs = useRef(null)
  const discRefs = useRef(null)
  const stateRefs = useRef(null)

  const onPostForm = useCallback(async (data) => {
    await csrf()

    const params = new FormData();
    Object.keys(data).forEach(function(key) {
      params.append(key, this[key])
    }, data)

    await axios.post('/api/liondor/post/store', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log(res)
    })
    .catch((e) => {
      console.error(e)
    })
  }, [])

  const onSubmitHandler = useCallback((e) => {
    e.preventDefault()
    onPostForm({
      user_id: userIdRef.current.value,
      l_category_id: catChildIdRefs.current.value,
      l_series_id: seriesIdRefs.current.value,
      title: ttlRefs.current.value,
      thumbs: thumbRefs.current.files[0],
      mv: mvRefs.current.files[0],
      sub_title: subTtlRefs.current.value,
      discription: discRefs.current.value,
      content: editorContent,
      state: stateRefs.current.value,
    })
  }, [onPostForm, editorContent])

  const [cat, setCat] = useState([posts.category[0]])
  const handleCat = (e) => {
    setCat(posts.category.filter((item) => {
      return item.id.toString() === e.target.value
    }))
  }

  return (
    <section className={styles.createSection}>
      <form onSubmit={onSubmitHandler}>
        <input type="text" name="user_id" value="1" ref={userIdRef} />
        <select name="l_category_id" ref={catIdRefs} onChange={handleCat}>
          {posts.category.map((cat, index) => (
            <option value={index+1} key={index+1}>{cat.name}</option>
          ))}
        </select>
        <select name="child_category" ref={catChildIdRefs}>
          {cat[0]?.child_category?.map((cat) => (
            <option value={cat.id} key={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select name="l_series_id" ref={seriesIdRefs}>
          {posts.series.map((series, index) => (
            <option value={index+1} key={index+1}>{series.name}</option>
          ))}
        </select>
        <input type="text" name="title" ref={ttlRefs} />
        <input type="file" name="thumbs" accept="image/*" ref={thumbRefs} />
        <input type="file" name="mv" accept="image/*" ref={mvRefs} />
        <textarea name="sub_title" ref={subTtlRefs}></textarea>
        <textarea name="discription" ref={discRefs}></textarea>
        <div>エディター</div>
        <PostEditor setEditorContent={setEditorContent} />
        <select name="state" ref={stateRefs}>
          <option value="0">下書き</option>
          <option value="1">公開済み</option>
        </select>
        <button>新規作成</button>
      </form>
    </section>
  );
}

export default CreatePost;