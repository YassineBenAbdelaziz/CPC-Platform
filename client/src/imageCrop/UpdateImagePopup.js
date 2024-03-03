import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { getCroppedImg } from './CropImage'
import { styles } from './styles'

const Demo = ({ classes, imageSrc, setImage, setChosen }) => {
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
    <div>
      <React.Fragment>
        <div className={classes.cropContainer}>
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
        <div className={classes.controls}>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              classes={{ root: classes.slider }}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              Rotation
            </Typography>
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              classes={{ root: classes.slider }}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </div>
          <Button
            onClick={showCroppedImage}
            variant="contained"
            color="primary"
            classes={{ root: classes.cropButton }}
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="inherit"
            classes={{ root: classes.cropButton }}
          >
            Cancel
          </Button>
        </div>
      </React.Fragment>
    </div>
  )
}

export const UpdateImage = withStyles(styles)(Demo)