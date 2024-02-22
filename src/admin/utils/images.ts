import { type FormImage } from '../types/images'

const splitImages = (
  images: FormImage[]
): { uploadImages: FormImage[], existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = []
  const existingImages: FormImage[] = []

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image)
    } else {
      existingImages.push(image)
    }
  })

  return { uploadImages, existingImages }
}

export const prepareImages = async (images: FormImage[], api): Promise<FormImage[]> => {
  const { uploadImages, existingImages } = splitImages(images)

  let uploadedImgs: FormImage[] = []
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile!)
    uploadedImgs = await api
      .mutateAsync(files)
      .then(response => response.uploads)
    // uploadedImgs = await uploadFile
    //   .mutate(files)
    //   .then(({ data }) => data.uploads)
  }

  return [...existingImages, ...uploadedImgs]
}
