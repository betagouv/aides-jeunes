export interface ImageResizeConfig {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0-1 for JPEG quality
  format?: "jpeg" | "png" | "webp"
}

const DEFAULT_CONFIG: ImageResizeConfig = {
  maxWidth: 200,
  maxHeight: 200,
  quality: 0.85,
  format: "jpeg",
}

export async function resizeImageToBase64(
  file: File,
  config: ImageResizeConfig = DEFAULT_CONFIG,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        const { maxWidth = 200, maxHeight = 200 } = config
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)

        const mimeType = config.format
          ? `image/${config.format}`
          : file.type || "image/jpeg"
        const quality = config.quality !== undefined ? config.quality : 0.85

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob from canvas"))
              return
            }

            const blobReader = new FileReader()
            blobReader.onload = (blobEvent) => {
              const base64 = blobEvent.target?.result as string
              resolve(base64)
            }
            blobReader.onerror = () => {
              reject(new Error("Failed to read blob"))
            }
            blobReader.readAsDataURL(blob)
          },
          mimeType,
          quality,
        )
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsDataURL(file)
  })
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/webp"]
  return validTypes.includes(file.type) && file.size > 0
}
