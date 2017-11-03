import * as fabric from 'fabric'
import { cloneDeep } from 'lodash'

function setup() {
  const fileInputEl = document.getElementById('file')
  const saveButtonEl = document.getElementById('save')
  const canvas = new fabric.Canvas('canvas')

  let fileName: string | null = null
  let fileExtension: string | null = null

  if (!fileInputEl) return
  if (!saveButtonEl) return
  if (!canvas) return

  fileInputEl.addEventListener('change', function (e) {
    const target = e.target as HTMLInputElement

    if (!target.files) return

    if (target.files.length === 1) {
      const file = target.files[0]

      console.log(file.name)

      const matched = file.name.match(/^(.+)\.(.+)$/)
      if (matched) {
        fileName = matched[1] as string
        fileExtension = matched[2] as string
      }

      const fileReader = new FileReader()

      fileReader.onload = function (event) {
        const imageBlob = fileReader.result

        fabric.Image.fromURL(imageBlob, function (oImage) {
          const imageInstance = minifyImage(oImage)

          const height = imageInstance.getHeight()
          const width = imageInstance.getWidth()

          canvas.setHeight(height)
          canvas.setWidth(width)

          imageInstance.lockMovementX = true
          imageInstance.lockMovementY = true

          canvas.add(imageInstance)

          const overlayInstance = cloneDeep(imageInstance)

          overlayInstance.opacity = 0.6
          overlayInstance.opacity = 0.6
          // minifyImage で scale を触っているので、ここはそのときの scale から算出しなければいけない
          overlayInstance.scale(overlayInstance.getScaleX() * 1.07)
          overlayInstance.lockMovementX = true
          overlayInstance.lockMovementY = true

          canvas.add(overlayInstance)
          overlayInstance.center()
        })
      }

      fileReader.readAsDataURL(file)
    }
  })

  saveButtonEl.addEventListener('click', function (e) {
    const dataUrl = canvas.toDataURL()

    const anchor = document.createElement('a') as HTMLAnchorElement
    anchor.href = dataUrl
    if (fileName !== null && fileExtension !== null) {
      anchor.download = `${fileName}_hakuryoku.${fileExtension}`
    } else {
      anchor.download = `hakuryoku.png`
    }

    anchor.click()
  })
}

const MAX_WIDTH = 400
const MAX_HEIGHT = 300
const MAX_AREA_SIZE = 400 * 300

function minifyImage(image: fabric.Image): fabric.Image {
  const width = image.getWidth()
  const height = image.getHeight()

  const area_size = width * height

  if (area_size > MAX_AREA_SIZE) {
    if (width > height) {
      const scale = MAX_WIDTH / width
      image.scale(scale)
    } else {
      const scale = MAX_HEIGHT / height
      image.scale(scale)
    }
  }

  return image
}

setup()
