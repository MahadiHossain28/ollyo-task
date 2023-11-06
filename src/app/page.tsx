import Image from 'next/image'
import styles from './page.module.css'
import 'bootstrap/dist/css/bootstrap.css'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'

export default function Home() {
  return (
    <div className='container'>
      <GalleryComponent/>
    </div>
  )
}
