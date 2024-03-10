import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './CropImage'
import './styles.css'

export const UpdateImage = ({ classes, imageSrc, setImage, setChosen }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const urlToFile = (url) => {
    let arr = url.split(",")
    let mime = arr[0].match(/:(.*?);/)[1]
    let data = arr[1]
    let ext = mime.split("/")[1]

    let dataStr = atob(data)
    let n = dataStr.length
    let dataArr = new Uint8Array(n)

    while(n--) {
        dataArr[n] = dataStr.charCodeAt(n)
    }
    return new File([dataArr], `image.${ext}`, {type: mime})
  }

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      setImage(urlToFile(croppedImage))
      // console.log(urlToFile(croppedImage));
      setChosen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const onClose = () => {
    setImage(null)
    setChosen(false)
  }

  return (
    <div className='cropping'>
      <React.Fragment>
        <div className='cropContainer'>
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            cropShape="round"
            showGrid={false}
            aspect={1}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className='controls'>
          <div className='sliderContainer'>
          <span> Zoom </span>
            <input className='slider' type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(e.target.value)} />
          </div>
          <div className='sliderContainer'>
            <span> Rotation </span>
            <input className='slider' type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(e.target.value)} />
          </div>
          <button className='save' onClick={showCroppedImage}> Save </button>
          <button className='cancel' onClick={onClose}> Cancel </button>
        </div>
      </React.Fragment>
    </div>
  )
}

